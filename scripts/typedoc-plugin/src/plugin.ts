// eslint-disable-next-line import/no-extraneous-dependencies
import { Application, Converter, Context, Reflection, Comment, CommentTag, SerializerComponent, ReflectionKind, SignatureReflection, ProjectReflection } from 'typedoc';
import ts from 'typescript';
import fs from 'fs-extra';
import ps from 'path';

const TAG_NAME_CC_CATEGORY = 'ccCategory';

const TAG_NAME_LEGACY_PUBLIC = 'legacyPublic'.toLowerCase();

const CATEGORY_CONFIG_FILE_NAME = 'category.json';

interface CategoryConfig {
    title: Record<string, string>;
    description?: Record<string, string>;
}

export function load (app: Application) {
    const engineRoot = process.cwd();

    app.converter.on(Converter.EVENT_CREATE_DECLARATION, onCreateReflection);

    app.converter.on(Converter.EVENT_CREATE_SIGNATURE, onCreateSignature);

    type ReflectionId = Reflection['id'];

    type CategoryInfo = {
        items: ReflectionId[];
    } & CategoryConfig;

    type CategoryMap = Record<string, CategoryInfo>;

    const categoryMap: CategoryMap = {};

    class CategoryMapSerializerComponent extends SerializerComponent<ProjectReflection> {
        serializeGroup (instance: Reflection): boolean {
            // Note: `instance instanceof ProjectReflection` can not be used!
            return instance
                && typeof instance === 'object'
                && typeof instance.isProject === 'function'
                && instance.isProject();
        }

        supports (item: unknown): boolean {
            return true;
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        toObject (projectReflect: ProjectReflection, obj = {}): any & {
            ccCategories: CategoryInfo[];
        } {
            return {
                ...obj,
                ccCategories: Object.values(categoryMap),
            };
        }
    }

    app.serializer.addSerializer(new CategoryMapSerializerComponent(app.serializer));

    function onCreateReflection (_context: Context, reflection: Reflection, node?: ts.Node) {
        handleDeclarationCategory(_context, reflection, node);
        handleTagLegacyPublic(_context, reflection, node);
    }

    function onCreateSignature (_context: Context, reflection: SignatureReflection, node?: ts.Node) {
        handleTagLegacyPublic(_context, reflection, node);
    }

    function handleDeclarationCategory (_context: Context, reflection: Reflection, node?: ts.Node) {
        if (!node) {
            return;
        }

        switch (reflection.kind) {
        case ReflectionKind.Class:
        case ReflectionKind.Interface:
        case ReflectionKind.Enum:
        case ReflectionKind.Variable:
        case ReflectionKind.Function:
        case ReflectionKind.Namespace:
            break;
        default:
            return;
        }

        // Prefer the already existing category tag.
        if (reflection.comment?.hasTag(TAG_NAME_CC_CATEGORY)) {
            return;
        }

        const sourceFile = node.getSourceFile();
        const sourceFileName = sourceFile.fileName;
        const category = queryCategory(sourceFileName);
        if (!category) {
            return;
        }

        setCategory(reflection.id, category.id, category.config);
    }

    function handleTagLegacyPublic (_context: Context, reflection: Reflection, node?: ts.Node) {
        const { comment } = reflection;
        if (!comment) {
            return;
        }

        if (!comment.hasTag(TAG_NAME_LEGACY_PUBLIC)) {
            return;
        }

        comment.removeTags(TAG_NAME_LEGACY_PUBLIC);
        comment.tags.push(new CommentTag('deprecated', undefined, 'This key is reserved for internal usage.'));
    }

    function setCategory (reflectionId: ReflectionId, categoryId: string, categoryConfig: CategoryConfig) {
        (categoryMap[categoryId] ??= {
            ...categoryConfig,
            items: [],
        }).items.push(reflectionId);
    }

    const categoryConfigCache: Record<string, CategoryConfig | null> = {};

    function queryCategory (sourceFileName: string) {
        for (const parentDir of forEachParentDir(sourceFileName)) {
            if (!(parentDir in categoryConfigCache)) {
                const categoryConfig = tryReadCategoryConfigFile(parentDir);
                categoryConfigCache[parentDir] = categoryConfig;
            }
            const categoryConfig = categoryConfigCache[parentDir];
            if (!categoryConfig) {
                continue;
            }
            return {
                id: parentDir,
                config: categoryConfig,
            };
        }
        return '';
    }

    function* forEachParentDir (sourceFileName: string) {
        const normalized = ps.normalize(sourceFileName);
        let currentDirName = ps.dirname(normalized);
        while (currentDirName !== engineRoot) {
            yield currentDirName;
            currentDirName = ps.dirname(currentDirName);
        }
    }

    function tryReadCategoryConfigFile (dir: string) {
        try {
            const categoryConfig = fs.readJsonSync(ps.join(dir, CATEGORY_CONFIG_FILE_NAME)) as CategoryConfig;
            return categoryConfig;
        } catch {
            return null;
        }
    }
}
