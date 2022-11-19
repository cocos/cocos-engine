import { OutputArchive, InputArchive } from './archive';
import { Color, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo, Uniform, UniformBlock } from '../../gfx';

export function saveColor (ar: OutputArchive, v: Color) {
    ar.writeNumber(v.x);
    ar.writeNumber(v.y);
    ar.writeNumber(v.z);
    ar.writeNumber(v.w);
}

export function loadColor (ar: InputArchive, v: Color) {
    v.x = ar.readNumber();
    v.y = ar.readNumber();
    v.z = ar.readNumber();
    v.w = ar.readNumber();
}

export function saveUniform (ar: OutputArchive, v: Uniform) {
    ar.writeString(v.name);
    ar.writeNumber(v.type);
    ar.writeNumber(v.count);
}

export function loadUniform (ar: InputArchive, v: Uniform) {
    v.name = ar.readString();
    v.type = ar.readNumber();
    v.count = ar.readNumber();
}

export function saveUniformBlock (ar: OutputArchive, v: UniformBlock) {
    ar.writeNumber(v.set);
    ar.writeNumber(v.binding);
    ar.writeString(v.name);
    ar.writeNumber(v.members.length);
    for (const v1 of v.members) {
        saveUniform(ar, v1);
    }
    ar.writeNumber(v.count);
}

export function loadUniformBlock (ar: InputArchive, v: UniformBlock) {
    v.set = ar.readNumber();
    v.binding = ar.readNumber();
    v.name = ar.readString();
    let sz = 0;
    sz = ar.readNumber();
    v.members.length = sz;
    for (let i = 0; i !== sz; ++i) {
        const v1 = new Uniform();
        loadUniform(ar, v1);
        v.members[i] = v1;
    }
    v.count = ar.readNumber();
}

export function saveDescriptorSetLayoutBinding (ar: OutputArchive, v: DescriptorSetLayoutBinding) {
    ar.writeNumber(v.binding);
    ar.writeNumber(v.descriptorType);
    ar.writeNumber(v.count);
    ar.writeNumber(v.stageFlags);
    // skip immutableSamplers;
}

export function loadDescriptorSetLayoutBinding (ar: InputArchive, v: DescriptorSetLayoutBinding) {
    v.binding = ar.readNumber();
    v.descriptorType = ar.readNumber();
    v.count = ar.readNumber();
    v.stageFlags = ar.readNumber();
    // skip immutableSamplers;
}

export function saveDescriptorSetLayoutInfo (ar: OutputArchive, v: DescriptorSetLayoutInfo) {
    ar.writeNumber(v.bindings.length);
    for (const v1 of v.bindings) {
        saveDescriptorSetLayoutBinding(ar, v1);
    }
}

export function loadDescriptorSetLayoutInfo (ar: InputArchive, v: DescriptorSetLayoutInfo) {
    const sz = ar.readNumber();
    v.bindings.length = sz;
    for (let i = 0; i !== sz; ++i) {
        const v1 = new DescriptorSetLayoutBinding();
        loadDescriptorSetLayoutBinding(ar, v1);
        v.bindings[i] = v1;
    }
}
