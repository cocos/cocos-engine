
### `compatibility-info.json`

This file is used to declare the compatibility of template files with previous versions.


Example:

```json
{
    // include all supported native platforms, such as windows, ios, android, mac etc.
    "native":  // required
    {
        "default": ">=3.6.0",    // required, applied if any specific platform value is not provided 
        "windows": VERSION_RANGE // optional, supported version for Windows
        "mac": VERSION_RANGE     // optional, supported version for Mac
        "ios": VERSION_RANGE     // optional, supported version for iOS
        "android": VERSION_RANGE // optional, supported version for Android
    }
}
```

#### The `VERSION_RANGE` syntax examples

##### Simple conditions

1. `>=3.6.0`
2. `>3.5.1`  
3. `<3.5.1`  
4. `<=3.5.1`  
5. `3.3.2`  , specify version
6. `!3.5.0` , excluded version

##### Composite conditions

The space is the 'AND'  operation, and the '||' is the 'OR' operation

1. `>=3.6.0 <3.7.0`
2. `3.4.2 || >= 3.6.0` 
3. `>=3.4.0 !3.4.2 <3.5.0 || 3.6.0`

##### Wildcard conditions 

1. `3.x` is equivalent to `>=3.0.0 <4.0.0` 
2. `3.4.x` is equivalent to `>= 3.4.0 <3.5.0
