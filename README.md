# Self Heal app

## Release gotchas

### Android App ID

Android does not allow dashes in the app ID, so you must edit this in config.xml before building

### Apple Advertising Identifier (IDFA)

The Google Analytics plugin adds the Ad Framework. In Xcode remove libAdIdAccess.a and AdSupport.framework from the build phases > Link Binary with Libraries section
