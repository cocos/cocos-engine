# 国际化

本文描述在贡献引擎功能到本仓库时，如何将功能国际化。具体来说，本文描述：

- 如何国际化一个 cc 类对象的可编辑属性。

## 术语

- `cc 类`

  指那些用 `@ccclass` 装饰器装饰的类。
  
- `cc 类名`

  指传给 `@ccclass()` 的类名参数。
  
- `编辑器属性`

  指 cc 类中，那些用 `@editable`、`@visible` 等装饰器装饰的属性。这些属性会在编辑器中展示。
  
- `字典`

  位于 `<本仓库>/editor/i18n/(en|zh)/localization.js` 中，里面以 JSON 形式记录了某些文本的中文、英文表示。

## 国际化 CC 类对象的可编辑属性

假设要操作类的 cc 类名为 `cc.animation.AnimationController`，要操作的属性在代码中的字段名为 `graph`，为了在编辑器中国际化该属性的的显示名称或工具提示，则需要保证字典中具有以下层级结构的数据：

```js
{
  classes: {
    'cc': {
      'animation': {
        'AnimationController': {
          properties: {
            'graph': {
              displayName: '<此属性的编辑器显示名称>',
              tooltip: '<此属性的工具提示。>',
            },
          },
        },
      },
    },
  },
}
```

很多时候，类的属性来自于基类。这种情况下，子类的字典中可以通过 `__extends__` 来继承基类的字典：

```js
{
  classes: {
    'base': {
      properties: {
        'baseProp': { /* ... */ }
      },
    },
    'sub': {
      properties: {
        __extends__: 'classes.base.properties', // 注意，这里要填入的是基类字典的 `properties` 属性的完整路径。
        'subProp': { /* ... */ }
      },
    },
  },
}
```

其效果就等同于子类的 `properties` 中也有了 `baseProp` 的部分。
