import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

// Instructor Dashboard Component
const InstructorDashboard = () => (
	<View style={styles.container}>
		<Text style={styles.welcomeText}>Welcome to the Instructor Dashboard!</Text>
	</View>
);

// Appointment Management Component
const AppointmentManagement = ({ email }) => {
	const [appointments, setAppointments] = useState([]);

	useEffect(() => {
		if (email) {
			const fetchAppointments = async () => {
				try {
					const response = await fetch(`http://192.168.0.103:5003/appointments?email=${email}`);
					const data = await response.json();
					setAppointments(data);
				} catch (error) {
					console.error("Error fetching appointments:", error);
				}
			};
			fetchAppointments();
		} else {
			console.error("Email is undefined or missing");
		}
	}, [email]);
	const renderItem = ({ item }) => (
		<View style={styles.appointmentItem}>
			<Text style={styles.appointmentText}>{item.details}</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Your Appointments</Text>
			<FlatList
				data={appointments}
				renderItem={renderItem}
				keyExtractor={(item) => item.id.toString()}
			/>
		</View>
	);
};
// Profile Screen Component
const ProfileScreen = ({ navigation, name, onProfileUpdate }) => {
	const user = navigation.getParam('user'); // Get user from passed data from navigation
	const [editName, setEditName] = useState(name);

	const handleSave = () => {
		onProfileUpdate(editName);
		Alert.alert("Profile Updated", "Your profile has been updated successfully.", [
			{
				text: "OK",
				onPress: () => navigation.navigate('Home'),
			},
		]);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.sectionHeader}>Profile</Text>
			<Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
			<Text style={styles.profileText}>Email: {user.email}</Text>
			<Text style={styles.profileText}>Role: {user.role}</Text>
			<TouchableOpacity style={styles.submitButton} onPress={handleSave}>
				<Text style={styles.submitButtonText}>Save Profile</Text>
			</TouchableOpacity>
		</View>
	);
};

// Custom Drawer Content with Logout
const CustomDrawerContent = (props) => {
	const navigation = useNavigation();
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props} />
			<View style={styles.logoutContainer}>
				<TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
					<Text style={styles.logoutButtonText}>Log Out</Text>
				</TouchableOpacity>
			</View>
		</DrawerContentScrollView>
	);
};

// Main Dashboard with AppointmentManagement Integrated
const DashboardProf = ({ name, onProfileUpdate }) => {
	return (
		<NavigationContainer independent={true}>
			<Drawer.Navigator
				initialRouteName="Instructor Dashboard"
				drawerContent={(props) => <CustomDrawerContent {...props} />}
			>
				<Drawer.Screen name="Instructor Dashboard" component={InstructorDashboard} />
				<Drawer.Screen name="Appointment Management" component={AppointmentManagement} />
				<Drawer.Screen name="Profile">
					{({ navigation }) => (
						<ProfileScreen
							navigation={navigation}
							name={name}
							onProfileUpdate={onProfileUpdate}
						/>
					)}
				</Drawer.Screen>
			</Drawer.Navigator>
		</NavigationContainer>
	);
};

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#fff',
	},
	sectionHeader: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	welcomeText: {
		fontSize: 20,
		margin: 20,
		textAlign: 'center',
	},
	appointmentItem: {
		padding: 10,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		width: '100%',
	},
	appointmentText: {
		fontSize: 16,
	},
	submitButton: {
		backgroundColor: '#276630',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 16,
	},
	logoutContainer: {
		marginTop: 500,
		paddingHorizontal: 20,
		borderColor: '#ccc',
	},
	logoutButton: {
		backgroundColor: '#dc3545',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	logoutButtonText: {
		color: '#fff',
		fontSize: 16,
	},
	profileText: {
		fontSize: 16,
		marginVertical: 5,
	},
});

export default DashboardProf;