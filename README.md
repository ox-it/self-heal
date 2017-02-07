# Self Heal app

## Release gotchas

### Android App ID

Android does not allow dashes in the app idea, so you must edit this in config.xml before building

### Apple Advertising Identifier (IDFA)

The Google Analytics plugin adds the Add Framework. In Xcode remove libAdIdAccess.a and AdSupport.framework from the build phases > Link Frameworks with Binaries section
