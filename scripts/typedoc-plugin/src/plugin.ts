// eslint-disable-next-line import/no-extraneous-dependencies
import { Application, Converter, Context, Reflection, Comment, CommentTag, SerializerComponent, ReflectionKind, SignatureReflection, ProjectReflection, ContainerReflection, DeclarationReflection, Serializer, SerializeEvent, ReferenceReflection } from 'typedoc';
import ts from 'typescript';
import fs from 'fs-extra';
import ps from 'path';
import { cullEngineInternal } from './cull-engine-internal';

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

    app.converter.on(Converter.EVENT_RESOLVE_END, (context: Context) => {
        const visit = (reflection: Reflection, visitor: (reflection: Reflection) => void) => {
            visitor(reflection);
            if (reflection instanceof DeclarationReflection) {
                for (const signature of reflection.getAllSignatures()) {
                    visit(signature, visitor);
                }
            }
            if (reflection instanceof ContainerReflection) {
                if (reflection.children) {
                    for (const child of reflection.children) {
                        visit(child, visitor);
                    }
                }
            } else if (reflection instanceof SignatureReflection) {
                if (reflection.parameters) {
                    for (const param of reflection.parameters) {
                        visit(param, visitor);
                    }
                }
                if (reflection.typeParameters) {
                    for (const typeParameter of reflection.typeParameters) {
                        visit(typeParameter, visitor);
                    }
                }
            }
        };

        visit(context.project, (reflection) => {
            handleLink(context, reflection);
        });
    });

    app.serializer.on(Serializer.EVENT_END, (serializeEvent: SerializeEvent) => {
        cullEngineInternal(serializeEvent.output)
    });

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
            const mergedCategoryMap: Record<string, CategoryInfo> = {};
            for (const categoryInfo of Object.values(categoryMap)) {
                // eslint-disable-next-line prefer-arrow-callback
                const categoryKey = JSON.stringify(categoryInfo, function excludeItems (this, k, v) {
                    if (this === categoryInfo && k === 'items' && v === categoryInfo.items) {
                        return undefined;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return v;
                    }
                });
                if (categoryKey in mergedCategoryMap) {
                    mergedCategoryMap[categoryKey].items.push(...categoryInfo.items);
                } else {
                    mergedCategoryMap[categoryKey] = categoryInfo;
                }
            }
            return {
                ...obj,
                ccCategories: Object.values(mergedCategoryMap),
            };
        }
    }

    app.serializer.addSerializer(new CategoryMapSerializerComponent(app.serializer));

    function onCreateReflection (_context: Context, reflection: Reflection, node?: ts.Node) {
        handleDeclarationCategory(_context, reflection, node);
        handleTagLegacyPublic(_context, reflection, node);
    }

    function onCreateSignature (_context: Context, reflection: SignatureReflection, node?: ts.Node) {
        fixTypeArguments(_context, reflection, node);
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

    // NOTE: this is a bug on typedoc, we fix in this plugin.
    // should not generate typeArguments field in typeParameters' type field.
    function fixTypeArguments (_context: Context, reflection: SignatureReflection, node?: ts.Node) {
        if (reflection.typeParameters) {
            for (const typeParam of reflection.typeParameters) {
                // @ts-ignore
                const typeArguments = typeParam.type?.typeArguments;
                if (typeArguments?.[0]?.name === typeParam.name) {
                    // @ts-ignore
                    delete typeParam.type.typeArguments;
                }
            }
        }
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

    function handleLink (_context: Context, reflection: Reflection, node?: ts.Node) {
        const comment = reflection.comment;
        if (!comment) {
            return;
        }

        let declarationReflection: DeclarationReflection | null = null;
        if (reflection instanceof DeclarationReflection) {
            declarationReflection = reflection;
        } else if (reflection instanceof SignatureReflection) {
            declarationReflection = reflection.parent;
        }

        // The container reflection of this reflection if it's subjected to "search in container first":
        // classes, interface, enumeration
        // Especially namespace member is not subjected to such search.
        const isSubjectedToContainerSearch = (declarationReflection: DeclarationReflection) => declarationReflection.kind === ReflectionKind.Class
            || declarationReflection.kind === ReflectionKind.Enum
            || declarationReflection.kind === ReflectionKind.Interface;
        let containerSearchReflection: Reflection | null = null;
        if (declarationReflection) {
            if (isSubjectedToContainerSearch(declarationReflection)) {
                containerSearchReflection = reflection;
            } else if (declarationReflection.parent
                && declarationReflection.parent instanceof DeclarationReflection
                && isSubjectedToContainerSearch(declarationReflection.parent)) {
                containerSearchReflection = declarationReflection.parent;
            }
        }

        {
            const text = handleText(comment.text);
            if (text) {
                comment.text = text;
            }
        }

        {
            const text = handleText(comment.shortText);
            if (text) {
                comment.shortText = text;
            }
        }

        if (comment.tags) {
            for (const tag of comment.tags) {
                const text = handleText(tag.text);
                if (text) {
                    tag.text = text;
                }
            }
        }

        function handleText (text: string) {
            if (!text) {
                return '';
            }
            const getLocation = () => {
                if (reflection.sources) {
                    return reflection.sources[0].fileName;
                } else if (node) {
                    return node.getText();
                } else {
                    return `<unknown-location>`;
                }
            };
            const matches = text.matchAll(/\[\[`?([\w.]+)`?(?:\s*\|(.*))?\]\]/g);
            const replaces: Array<{ index: number; length: number; reflection: Reflection; linkText?: string; }> = [];
            for (const match of matches) {
                const full = match[0];
                const startsWithQuote = full.startsWith('[[`');
                const endsWithQuote = full.endsWith('`]]');
                if (startsWithQuote !== endsWithQuote) {
                    _context.logger.error(`Syntax error: ${full},`
                        + `referenced in ${getLocation()}`);
                    continue;
                }
                const path = match[1];
                const segments = path.split('.');
                if (segments.length === 0) {
                    continue;
                }
                const printUnableResolve = (iSegment: number) => {
                    _context.logger.warn(`Failed to resolve ${segments[iSegment]} in ${match[0]} `
                        + `referenced in ${!node ? '<unknown-location>' : node.getText()}`);
                };
                let targetReflection = resolveUnqualifiedReflection(segments[0]);
                if (!targetReflection) {
                    printUnableResolve(0);
                    continue;
                }
                if (segments.length > 1) {
                    for (let iSegment = 1; iSegment < segments.length; ++iSegment) {
                        const currentReflections = getAllRelatedReflections(targetReflection);
                        targetReflection = null;
                        let hasAtLeastOneContainer = false;
                        const segment = segments[iSegment];
                        for (const currentReflection of currentReflections) {
                            let realReflection = currentReflection;
                            if (realReflection instanceof ReferenceReflection) {
                                realReflection = realReflection.getTargetReflectionDeep();
                            }
                            if ((realReflection.kind === ReflectionKind.Variable ||
                                realReflection.kind === ReflectionKind.Property) &&
                                realReflection instanceof DeclarationReflection &&
                                realReflection.type &&
                                realReflection.type.type === 'reference' &&
                                realReflection.type.reflection) {
                                // [[game.init]] -> [[Game.init]]
                                realReflection = realReflection.type.reflection;
                            }
                            if (!(realReflection instanceof ContainerReflection)) {
                                continue;
                            }
                            hasAtLeastOneContainer = true;
                            if (!realReflection.children) {
                                continue;
                            }
                            targetReflection = realReflection.children.find((child) => child.name === segment) ?? null;
                            if (targetReflection) {
                                break;
                            }
                        }
                        if (!targetReflection) {
                            if (!hasAtLeastOneContainer) {
                                _context.logger.error(`${segments.slice(0, iSegment).join('.')} in ${match[0]} `
                                    + `is not a container, referenced in ${getLocation()}`);
                            } else {
                                printUnableResolve(iSegment);
                            }
                            break;
                        }
                    }
                }
                if (!targetReflection) {
                    continue; // We should have diagnosis
                }
                const matchIndex = match.index ?? 0;
                replaces.push({
                    index: matchIndex,
                    length: match[0].length,
                    reflection: targetReflection,
                    linkText: match[2]?.trim(),
                });
            }

            if (replaces.length === 0) {
                return '';
            }

            let finalText = '';
            let iLast = 0;
            for (const { index, length, reflection, linkText } of replaces) {
                finalText += text.substring(iLast, index);
                finalText += `[[${reflection.id}${linkText ? ` | ${linkText}` : ''}]]`;
                iLast = index + length;
            }
            if (iLast !== text.length) {
                finalText += text.substring(iLast);
            }
            return finalText;
        }

        function resolveUnqualifiedReflection (name: string) {
            let targetReflection: Reflection | null = null;

            if (containerSearchReflection) {
                for (const reflection of getAllRelatedReflections(containerSearchReflection)) {
                    if (reflection instanceof ContainerReflection && reflection.children) {
                        const child = reflection.children.find((child) => child.name === name);
                        if (child) {
                            targetReflection = child;
                        }
                    }
                }
            }

            if (!targetReflection) {
                let parent: Reflection | null = reflection.parent ?? null;
                while (parent) {
                    if (parent instanceof ContainerReflection &&
                        parent.children &&
                        ((parent.kind === ReflectionKind.Namespace
                            || parent.kind === ReflectionKind.Module
                            || parent.kind === ReflectionKind.Project))) {
                        for (const childReflection of parent.children) {
                            if (childReflection.name === name) {
                                targetReflection = childReflection;
                                break;
                            }
                        }
                    }
                    parent = parent.parent ?? null;
                }
            }

            return targetReflection;
        }

        function getAllRelatedReflections(reflection: Reflection) {
            const relatedReflections: Reflection[] = (reflection.parent && reflection.parent instanceof ContainerReflection && reflection.parent.children)
                ? reflection.parent.children.filter(({ name }) => reflection.name === name)
                : [reflection];
            for (const reflection of relatedReflections) {
                let currentReflection = reflection;
                if (currentReflection.kind !== ReflectionKind.Class) {
                    continue;
                }
                while (true) {
                    if (!(currentReflection instanceof DeclarationReflection) || currentReflection.kind !== ReflectionKind.Class) {
                        break;
                    }
                    const extendedType = currentReflection.extendedTypes?.[0];
                    if (!extendedType) {
                        break;
                    }
                    if (extendedType.type !== 'reference') {
                        break;
                    }
                    // @ts-ignore
                    const extendedReflection: Reflection = extendedType.reflection;
                    if (!extendedReflection) {
                        break;
                    }
                    if (extendedReflection.parent && extendedReflection.parent instanceof ContainerReflection &&
                        extendedReflection.parent.children) {
                        const ns = extendedReflection.parent.children.find((r) => {
                            return r.name === extendedReflection.name && r.kind === ReflectionKind.Namespace;
                        });
                        if (ns) {
                            relatedReflections.push(ns);
                        }
                    }
                    currentReflection = extendedReflection;
                }
                break;
            }
            return relatedReflections;
        }
    }
}
