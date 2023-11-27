import { CommentDisplayPart, ReflectionKind } from "typedoc";

// This file is used to keep compatiblity of the output serialized json between typedoc 0.22 and 0.23 versions.
// Here we migrate the output of 0.23 to the standard of 0.22.

const groupTitle2Kind: Record<string, ReflectionKind> = {
    Accessors: ReflectionKind.Accessor,
    Methods: ReflectionKind.Method,
    Properties: ReflectionKind.Property,
    Functions: ReflectionKind.Function,
    Enumerations: ReflectionKind.Enum,
    Constructors: ReflectionKind.Constructor,
    Classes: ReflectionKind.Class,
    Interfaces: ReflectionKind.Interface,
    Variables: ReflectionKind.Variable,
    References: ReflectionKind.Reference,
    Namespaces: ReflectionKind.Namespace,
    'Enumeration Members': ReflectionKind.EnumMember,
    'Type Aliases': ReflectionKind.TypeAlias,
    Projects: ReflectionKind.Project,
    Modules: ReflectionKind.Module,
    Enums: ReflectionKind.Enum,
    Classs: ReflectionKind.Class,
    Propertys: ReflectionKind.Property,
    CallSignatures: ReflectionKind.CallSignature,
    IndexSignatures: ReflectionKind.IndexSignature,
    ConstructorSignatures: ReflectionKind.ConstructorSignature,
    Parameters: ReflectionKind.Parameter,
    TypeLiterals: ReflectionKind.TypeLiteral,
    TypeParameters: ReflectionKind.TypeParameter,
    GetSignatures: ReflectionKind.GetSignature,
    SetSignatures: ReflectionKind.SetSignature,
    ObjectLiterals: ReflectionKind.ObjectLiteral,
};

function getKind (title: string): ReflectionKind | undefined {
    const kind = groupTitle2Kind[title];
    if (typeof kind === 'undefined') {
        console.warn(`Unknown group title ${title}`);
    }
    return kind;
}

export function migrateGroups (groups: any[]) {
    for (const group of groups) {
        if (typeof group.kind === 'undefined') {
            const kind = getKind(group.title);
            if (typeof kind !== 'undefined') {
                group.kind = kind;
            }
        }
        if (group.title === 'Enumeration Members') {
            group.title = 'Enumeration members';
        } else if (group.title === 'Type Aliases') {
            group.title = 'Type aliases';
        }
    }
}

export function migrateComment (comment: Record<string, any>) {
    if (comment.summary) {
        comment.text = mergeCommentDisplayPart(comment.summary);
        delete comment.summary;

        const migrateRes = migrateShortText(comment.text);
        if (migrateRes.shortText) {
            comment.shortText = migrateRes.shortText;
            comment.text = migrateRes.text;
        }
    } else if (comment.text) {
        const migrateRes = migrateShortText(comment.text);
        if (migrateRes.shortText) {
            comment.shortText = migrateRes.shortText;
            comment.text = migrateRes.text;
        }
    }
    if (comment.blockTags) {
        for (const blockTag of comment.blockTags) {
            blockTag.tag = blockTag.tag.slice(1);  // remove '@'
            blockTag.tag = blockTag.tag.toLowerCase();
            if (blockTag.content) {
                blockTag.text = mergeCommentDisplayPart(blockTag.content);
                delete blockTag.content;
            }
        }
        comment.tags = comment.blockTags;
        delete comment.blockTags;
    }
}

export function migrateGetSetSignature (accessor: Record<string, any>) {
    let existComment: Record<string, any> | undefined;
    const signaturesLackComment: Record<string, any>[] = [];
    if (accessor.getSignature && !Array.isArray(accessor.getSignature)) {
        if (accessor.getSignature.comment) {
            existComment = accessor.getSignature.comment;
        } else {
            signaturesLackComment.push(accessor.getSignature);
        }
        accessor.getSignature = [accessor.getSignature];
    }
    if (accessor.setSignature && !Array.isArray(accessor.setSignature)) {
        if (accessor.setSignature.comment) {
            existComment = accessor.setSignature.comment;
        } else {
            signaturesLackComment.push(accessor.setSignature);
        }
        accessor.setSignature = [accessor.setSignature];
    }

    if (existComment) {
        signaturesLackComment.forEach(signature => {
            signature.comment = existComment;
        });
    }
}

export function migrateUrl (obj: Record<string, any>) {
    if (obj && obj.url) {
        delete obj.url;
    }
}

export function migrateKindString (obj: Record<string, any>) {
    if (obj && obj.kindString) {
        if (obj.kindString === 'Enumeration Member') {
            obj.kindString = 'Enumeration member';
        }
    }
}

function mergeCommentDisplayPart (commentDisplayPartList: CommentDisplayPart[]): string {
    let text = '';
    for (const commentDisplayPart of commentDisplayPartList) {
        if (commentDisplayPart.kind === 'text' || commentDisplayPart.kind === 'code') {
            text += commentDisplayPart.text;
        } else if (commentDisplayPart.kind === 'inline-tag') {
            text += `[[${commentDisplayPart.target}]]`;
        }
    }
    return text + '\n';
}

function migrateShortText (text: string): { shortText?: string, text: string } {
    let shortText: string | undefined;
    const splitText = text.split('\n');
    if (splitText[1] === '' || splitText[1] === '\r') {
        shortText = splitText[0];
        splitText.splice(0, 2);
        text = splitText.join('\n');
    }
    return {
        shortText,
        text,
    };
}