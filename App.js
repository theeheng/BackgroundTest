/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import Realm from 'realm';
import {StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import BackgroundFetch from "react-native-background-fetch";
import {DB_NAME, InsertLog} from './InsertLog';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = { dataSource: null };
    this.refreshList = this.refreshList.bind(this);
  }
  
  componentDidMount() {
    // Configure it.
    BackgroundFetch.configure({
      minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
      stopOnTerminate: false,   // <-- Android-only,
      startOnBoot: true,         // <-- Android-only
      enableHeadless: true,
    }, () => {
      console.log("[js] Received background-fetch event");
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      InsertLog();
      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });

    this.initialiseDB();
    this.refreshList();
  }

  initialiseDB = () => {
    const realm = new Realm(
    {
      path: DB_NAME,
      schema: [
        {
          name: 'background_execution_log',
          properties: {
            execution_id: {type: 'int', default: 0},
            execution_date: 'string',
            execution_description: 'string', 
          },
        },
      ],
      schemaVersion: 1,
    });

    realm.close();
  }

  refreshList = () => {
    const realm = new Realm({path: DB_NAME});

    var log_details = realm.objects('background_execution_log');
    
    this.setState({
      dataSource: log_details,
    });
  }

  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 0.5, width: '100%', backgroundColor: '#000' }} />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Execution Log List</Text>
        <ScrollView>
        <FlatList
          style={styles.list}
          data={this.state.dataSource}
          keyExtractor={rowItem => `${rowItem.execution_id}` }
          renderSeparator={this.ListViewItemSeparator}
          renderItem={rowData => (
            <View key={rowData.item.execution_id} style={{ backgroundColor: 'white', padding: 24 }}>
              <Text>Id: {rowData.item.execution_id}</Text>
              <Text>Execution Date: {rowData.item.execution_date}</Text>
              <Text>Execution Description: {rowData.item.execution_description}</Text>
            </View>
          )}
        />
        </ScrollView>
       <TouchableOpacity style={styles.button} onPress={this.refreshList}>
        <Text style={styles.buttonText}>Refresh Log</Text>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  list: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#3a59b7',
    color: '#ffffff',
    padding: 10,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 35
  },
  buttonText: {
    color: '#ffffff',
  },
});
