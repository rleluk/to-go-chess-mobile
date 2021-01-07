# Configuration

Configuration copied from https://reactnative.dev/docs/environment-setup -> React Native CLI Quickstart.   

## Install Node, Python2 and JDK.  
If you have already installed Node on your system, make sure it is Node 10 or newer. If you already have a JDK on your system, make sure it is version 8 or newer.   

## Install Android Studio.
Download and install Android Studio: https://developer.android.com/studio/index.html. While on Android Studio intallation wizard, make sure the boxes next to all of the following items are checked:
- Android SDK
- Android SDK Platform
- Android Virtual Device   

## Install Android SDK.
Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 10 (Q) SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.   
To do that, open Android Studio, click on "Configure" button and select "SDK Manager".   
Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 10 (Q) entry, then make sure the following items are checked:
- Android SDK Platform 29
- Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image   

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that 29.0.2 is selected.    
Finally, click "Apply" to download and install the Android SDK and related build tools.

## Configure the ANDROID_HOME environment variable.
The React Native tools require some environment variables to be set up in order to build apps with native code.
1. Open the Windows Control Panel.
2. Click on User Accounts, then click User Accounts again
3. Click on Change my environment variables
4. Click on New... to create a new ANDROID_HOME user variable that points to the path to your Android SDK.   

The SDK is installed, by default, at the following location: %LOCALAPPDATA%\Android\Sdk.

## Add platform-tools to Path.
1. Open the Windows Control Panel.
2. Click on User Accounts, then click User Accounts again
3. Click on Change my environment variables
4. Select the Path variable.
5. Click Edit.
6. Click New and add the path to platform-tools to the list.   

The default location for this folder is: %LOCALAPPDATA%\Android\Sdk\platform-tools.

# Install dependencies
To install project dependencies, in root folder run:
```bash
npm install
```

# Run application
To run app, first of all open your android emulator (for instance Galaxy Nexus API 22 - needs to be installed from Android Studio's AVD Manager) and execute:
```bash
npx react-native run-android
```