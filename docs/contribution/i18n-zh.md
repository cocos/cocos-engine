# 国际化

本文描述在贡献引擎功能到本仓库时，如何将功能中出现的一些文本国际化。具体来说，本文描述：

- 如何让一个 cc 类对象的可编辑属性的 **显示名称**、**工具提示** 有贴合当前语言环境的表现。

## 术语

- `cc 类`

  指那些用 `@ccclass` 装饰器装饰的类。
  
- `cc 类名`

  指传给 `@ccclass()` 的类名参数。
  
- `编辑器属性`

  指 cc 类中，那些用 `@editable`、`@visible` 等装饰器装饰的属性。这些属性会在编辑器中展示。
  
- `字典`

  每个目标语言都有一个字典文件。里面存储的是一些文本在该语言中的表示。 本仓库目前支持简体中文和英文两种语言：
  
  - [简体中文](/editor/i18n/zh/localization.js)

  - [英文](/editor/i18n/en/localization.js)

  > 该字典文件是用 JS 代码生成的。该 JS 模块导出的内容就是字典对象的内容。

## 国际化 CC 类对象的可编辑属性

假设有以下 cc 类：

```ts
@ccclass('cc.Animation')
class Animation {
  @editable
  clips: AnimationClip[] = [];
  
  @editable
  defaultClip: AnimationClip | null = null;
}
```

为了在编辑器中多语言展示属性 `clips` 和 `defaultClip` 的显示名称或工具提示，只需在 **各个语言字典** 的 `classes.cc` 对象里面，加入以下数据：

```js
// 确保这一段包裹在字典的 `classes.cc` 对象中。
'Animation': {
  properties: {
    'clips': {
      displayName: '<属性 clips 的编辑器显示名称>',
      tooltip: '<属性 clips 的工具提示。>',
    },
    'defaultClip': {
      displayName: '<属性 defaultClip 的编辑器显示名称>',
      tooltip: '<属性 defaultClip 的工具提示。>',
    },
  },
},
```

又比如，你的 cc 类名是 `cc.physics.BoxCollidier`，那么只需在 `BoxCollidier` 外套个命名空间即可：

```js
// 确保这一段包裹在字典的 `classes.cc` 对象中。
'physics': {
  'BoxCollidier': {
    properties: { /* ... */ },
  }
},
```

### 字典继承

很多时候，类的属性来自于基类。例如：

```ts
@ccclass('Base')
class Base {
  @editable
  baseProp = 1;
}

@ccclass('Sub')
class Sub extends Base {
  @editable
  subProp = false;
}
```

为了声明这种属性继承关系，子类的字典中可以通过 `__extends__` 来继承基类的字典：

```js
{
  classes: {
    'base': { // 基类字典
      properties: {
        'baseProp': { /* ... */ }
      },
    },
    
    'sub': { // 子类字典
      properties: {
        __extends__: 'classes.base.properties', // 继承基类字典的所有属性。注意，这里要填入的是基类字典的 `properties` 属性的完整路径。
        'subProp': { /* ... */ }
      },
    },
  },
}
```

