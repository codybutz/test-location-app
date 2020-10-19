import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Location from 'expo-location';
import * as TaskManager from "expo-task-manager";
import * as Permissions from 'expo-permissions';

export default class App  extends Component {
    async startTracking() {
        const permission = await Permissions.askAsync(Permissions.LOCATION);
        if (permission.status === 'granted') {

            console.log('Attempting to start tracking.');
            console.log(TaskManager.isTaskDefined('test-app-location'));
            Location.startLocationUpdatesAsync('test-app-location', {
                accuracy: Location.Accuracy.Highest,
                activityType: Location.ActivityType.AutomotiveNavigation,
                timeInterval: 1000,
                distanceInterval: 0,
                foregroundService: {
                    notificationTitle: 'Test App Tracking',
                    notificationBody: 'Currently actively tracking.'
                },
                pausesUpdatesAutomatically: false,
            }).then(() => {
                console.log('Location tracking - Background task');
            }).catch((err) => {
                console.error('Unable to start tracking')
                console.error(err);
            });
        } else {
            console.log('Unable to get permission...');
        }
    }

    componentDidMount() {
        Location.hasStartedLocationUpdatesAsync('test-app-location').then((result) => {
            if (result) {
                Location.stopLocationUpdatesAsync('test-app-location').then(() => {
                    console.log('Location updates stopped');
                });
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{color: '#000'}}>Ejected app test v2</Text>
                <TouchableOpacity
                    style={{backgroundColor: '#004470', borderRadius: 5, padding: 20}}
                    onPress={() => {this.startTracking()}}
                >
                    <Text style={{color: '#fff'}}>Click here to start tracking</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

TaskManager.defineTask(
    'test-app-location',
    ({ data, error }) => {
        console.log('Hello - task received execution');
        if (error) {
            // Error occurred - check `error.message` for more details.
            console.error('Unable to start location task.');
            console.error(error);
            return;
        }

        if (data) {
            console.log(Date.now());
            console.log(data);
        }
    }
);


