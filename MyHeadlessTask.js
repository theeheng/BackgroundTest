import { InsertLog } from "./InsertLog";
import BackgroundFetch from "react-native-background-fetch";

export default MyHeadlessTask = async (event) => {
  console.log('[BackgroundFetch HeadlessTask] start');

  const result = await InsertLog(true);

  // Required:  Signal to native code that your task is complete.
  // If you don't do this, your app could be terminated and/or assigned
  // battery-blame for consuming too much time in background.
  BackgroundFetch.finish();
}