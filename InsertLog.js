import Realm from 'realm';

export const DB_NAME = 'ExecutionDB.realm';

export const InsertLog = async(isHeadlessOperation) => {

  console.log('[InsertLog] start');

  // Perform an example HTTP request.
  // Important:  await asychronous tasks when using HeadlessJS.
  //let response = await fetch('https://facebook.github.io/react-native/movies.json');
  //let responseJson = await response.json();
  //console.log('[InsertLog] response: ', responseJson);
  const currentDate = new Date().toString();

  const description = (isHeadlessOperation) ? 'Execution from HeadlessJS call' : 'Execution from background fetch event';
  const realm = new Realm({path: DB_NAME});
  realm.write(() => {
  	const ID = realm.objects('background_execution_log').sorted('execution_id', true).length > 0
  		? realm.objects('background_execution_log').sorted('execution_id', true)[0].execution_id + 1
  		: 1;

  	realm.create('background_execution_log', {
  		execution_id: ID,
  		execution_date: currentDate,
  		execution_description: description,
  	});
  });

  realm.close();

  console.log('[InsertLog] finished');

  return true;
};
