<<<<<<< HEAD
# React Native **My Tasks** Application with Notifications & Prioritization
#By--Priti Paul#

## Overview
It's a basic but working To-Do List app developed with **React Native** and **Expo**. The application provides the following features:
-Main file is in index.tsx.
- Adding tasks with text input field
- Assigning a priority level (High, Medium, Low) to every task
- Marking tasks as done
- Delete or edit tasks
- Get a local notification reminder a short while after adding a task

All tasks are stored locally via AsyncStorage.

##  How to Set Up & Run the App (Using Expo Go)
### Requirements:
- Node.js installed
- Expo CLI installed (`npm install -g expo-cli`)
- Expo Go app on your mobile phone (from Google Play / App Store) or Android Studio Installed  to run the app.

##SetUp Steps
-To create a new project, run the following command:npx create-expo-app@latest
-Scan the QR code to download the app from the Google Play Store, or visit the Expo Go page on the Google Play Store.
-npx expo start(To Start the development server)
-Open the app on your device

##Design Decisions & Challenges
Task Priority Integration: A priority selector UI was added using TouchableOpacity buttons, with simple visual feedback.

Inline Editing: ChoOse inline editing instead of navigating to a separate screen to keep the UX minimal and direct.

expo-Notification : Android push functionality provided by expo-notifications was removed from expoGo with the release of SDK 53.

Data Persistance: ensuring the data correctly loads and saves the tasks.





  
=======
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
>>>>>>> 77a887d (Initial commit)
