import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';

import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);



const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [isScanning, setIsScanning] = useState(false);


  //'MOVING ON TO GETTING LIST OF CONNECTED PERIPHERALS
  const peripherals = new Map()
  const [connectedDevices, setConnectedDevices] = useState([]);



  // const handleGetConnectedDevices = () => {
  //   BleManager.getBondedPeripherals([]).then(results => {
  //     console.log("Bonded peripherals: " + results.length);
  //     console.log(results[0].name)
  //   });
  // };


  //'getBondedPeripherals method grabs a list of all the devices paired to phone
  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      if (results.length === 0) {
        console.log('No connected bluetooth devices');
      } else {
        for (let i = 0; i < results.length; i++) {
          let peripheral = results[i]
          //peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          //setConnectedDevices(Array.from(peripherals.values()));//'TRYING TO UPDATE ConnectedDevices state array using setConnectedDevices
        }
        console.log(peripherals)
      }
    });
  };



  //'useEffect hook, stuff in here runs on startup of app
  useEffect(() => {

    


    // start bluetooth manager
    BleManager.start({showAlert: false}).then(() => {
    console.log('BleManager initialized');
    handleGetConnectedDevices();
    //startConnection();
    startScan(); //commented before
    //startConnection();
    //collectServices();
    //readData();
    
    //disconnectDevice();
    })

    // turn on bluetooth if it is not on

    //didnt put the code in here for bluetooth thing that was having nullproperty error


       //if (Platform.OS === 'android' && Platform.Version >= 23) {
      // PermissionsAndroid.check(
      //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      // ).then(result => {
      //   if (result) {
      //     console.log('Permission is OK');
      //   } else {
      //     PermissionsAndroid.request(
      //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //     ).then(result => {
      //       if (result) {
      //         console.log('User accept');
      //       } else {
      //         console.log('User refuse');
      //       }
      //     });
      //   }
      // });
    //}

//

//doing the bluetooth scan permission
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
    ).then(result => {
      console.log('permissions check is returning ' + result)
      if (result) {
        console.log('bluetooth_scan Permission is OK');
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ).then(result => {
          if (result) {
            console.log('User accept bluetooth_scan');
          } else {
            console.log('User refuse bluetooth_scan');
          }
        });
      }
    });



    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    ).then(result => {
      console.log('permissions check is returning ' + result)
      if (result) {
        console.log('bluetooth_connect Permission is OK');
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ).then(result => {
          if (result) {
            console.log('User accept bluetooth_connect');
          } else {
            console.log('User refuse bluetooth_connect');
          }
        });
      }
    });








    //ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED
//
//
//

    // let stopListener = BleManagerEmitter.addListener(
    //   'BleManagerStopScan',
    //   () => {
    //     setIsScanning(false);
    //     console.log('Scan is stopped');
    //   },
    // );



  }, []);//'END OF USEEFFECT HOOK



  const startScan = () => {
      BleManager.scan(["4fafc201-1fb5-459e-8fcc-c5c9c331914b"], 5, true)//'RUN SCAN FOR 5 SECONDS
        .then((device) => {

          console.log("bluetooth phonescan running")
          console.log(device)
          //console.log(device)
          //if (device.name?.includes('HM-10')){
            //add device
          //}
        })
        .catch(error => {
          console.error(error);
        });
    }





// const startScan = () => {
//     if (!isScanning) {
//       BleManager.scan(["4fafc201-1fb5-459e-8fcc-c5c9c331914b"], 5, true)//'RUN SCAN FOR 5 SECONDS
//         .then((device) => {
//           setIsScanning(true);//'THIS IS RUNNING
//           console.log("bluetooth phonescan running")
//           console.log(device)
//           //console.log(device)
//           //if (device.name?.includes('HM-10')){
//             //add device
//           //}
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }
//   };



  // const startScan = () => {
  //   if (!isScanning) {
  //     BleManager.scan([], 5, true)//'RUN SCAN FOR 5 SECONDS
  //       .then(() => {
  //         setIsScanning(true);//'THIS IS RUNNING
  //         console.log("bluetooth phonescan running")
  //         //console.log(device)
  //         //if (device.name?.includes('HM-10')){
  //           //add device
  //         //}
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   }
  // };


  //'the BleManager.connect method takes the MAC address not a uuid for service/characteristic
  const startConnection = () => {
    BleManager.connect("A8:42:E3:4C:8C:96").then(() => {
      console.log("connected to esp32")
    })
    .catch((error) => {
      console.log("couldn't connect to esp32")
      console.log(error)
    })
  }

  // const startConnection = () => {
  //   BleManager.connect(Deviceid).then(() => {
  //     console.log("connected to esp32")
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })
  // }

  const collectServices = () => {
    BleManager.retrieveServices("A8:42:E3:4C:8C:96").then((peripheralInfo) => {
      console.log("esp32 Peripheral info: ", peripheralInfo)
    }).catch((error) => {
      console.log(error)
    })
  }



//' serviceUUID is 4fafc201-1fb5-459e-8fcc-c5c9c331914b
//' characteristicUUID is beb5483e-36e1-4688-b7f5-ea07361b26a8
  const readData = () => {
    BleManager.read("A8:42:E3:4C:8C:96","4fafc201-1fb5-459e-8fcc-c5c9c331914b","beb5483e-36e1-4688-b7f5-ea07361b26a8").then((readData) => {
      console.log("Read: " + readData)
      console.log("converting")
      //const buffer = Buffer.from(readData)
      //const sensorData = buffer.readUInt8()
      //console.log(sensorData)
    })
  }


  const disconnectDevice = () => {
    BleManager.disconnect("A8:42:E3:4C:8C:96").then(() => {
      console.log("disconnected")
    })
  }




  return (
    <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}
        contentContainerStyle={styles.mainBody}
        contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
            marginBottom: 40,
          }}>
          <View>
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
                color: isDarkMode ? Colors.white : Colors.black,
              }}>
              React Native BLE Manager Tutorial
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.5} style={styles.buttonStyle} onPress={startScan}>
            <Text style={styles.buttonTextStyle}>
              {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const windowHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});



export default App;