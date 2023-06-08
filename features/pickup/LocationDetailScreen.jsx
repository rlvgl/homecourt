import React, { useState, useEffect } from 'react'
import { Button, Center, Heading, Text, VStack, HStack, Box } from 'native-base'
import { Linking, Platform } from 'react-native'
import { collection, query, where, getDocs, doc, addDoc, deleteDoc } from "firebase/firestore";
import { db, app } from '../../firebase'
import { getAuth } from 'firebase/auth'


export default LocationInfoScreen = ({ navigation, route }) => {
    const [users, setUsers] = useState([])
    const [activeAtLocation, setActiveAtLocation] = useState(false)
    const [docId, setDocId] = useState("")
    // const 

    const location = route.params.location
    const mapsURL = `https://www.google.com/maps?q=${location.address} ${location.city}`.replace(/\s+/g, "+")
    const destination = encodeURIComponent(`${location.address}, ${location.city}`);
    const provider = Platform.OS === 'ios' ? 'apple' : 'google'
    const link = `http://maps.${provider}.com/?daddr=${destination}`;
    const auth = getAuth(app)

    const openInMaps = async () => {
        const supported = await Linking.canOpenURL(link);
        if (supported) Linking.openURL(link);
    }

    const getActiveUsers = async () => {
        const q = query(collection(db, "activeUsers"), where("locationId", "==", location.locationId), where('active', "==", true))
        const querySnapshot = await getDocs(q)
        const userList = []
        querySnapshot.forEach(doc => {

            // time invalidation
            const userData = doc.data()
            const timeInvalidated = new Date(userData.inactiveAt)
            const timeNow = new Date()
            if (timeInvalidated > timeNow) { // if time to make user inactive is after current time, add user to userList
                // console.log(timeInvalidated.toUTCString())
                userList.push(doc.data().userEmail)
            }
        })

        // console.log(userList)
        await setUsers(userList)

    }

    const deleteActiveUser = async () => {

        const getQuery = query(collection(db, "activeUsers"), where("userEmail", "==", auth.currentUser.email))
        const querySnapshot = await getDocs(getQuery)
        const userIds = []
        querySnapshot.forEach(async d => {

            // console.log(doc.data())
            // console.log(d.id)

            // console.log("deleting: " + data["userId"])
            // deleteDoc(doc(db, "activeUsers", data["userId"]))
            // await db.collection("activeUsers").document(data["userId"]).delete()
            userIds.push(d.id)
            // await deleteDoc(doc(db, "activeUsers", data["userId"]))
        })

        // console.log(userIds) 
        userIds.forEach(async d => await deleteDoc(doc(db, "activeUsers", d)))

        await setActiveAtLocation(false)
        // console.log("users after deletion: " + users)


    }

    const addActiveUser = async () => {

        if (activeAtLocation) return


        // check if user is already active

        if (users.includes(auth.currentUser.email)) {
            setActiveAtLocation(true)
            return
        }

        // const q = query(collection(db, "activeUsers"), where("userEmail", "==", auth.currentUser.email))
        // const querySnapshot = await getDocs(q)
        // if (querySnapshot.length > 0) {
        //     setActiveAtLocation(true)
        //     return
        // }

        const address = location.address
        const joinedAt = new Date()
        const inactiveAt = (new Date()).setHours(joinedAt.getHours() + 2)
        const userEmail = auth.currentUser.email
        const userId = auth.currentUser.uid
        const active = true
        const locationId = location.locationId

        const docRef = await addDoc(collection(db, "activeUsers"), {
            address: address,
            joinedAt: joinedAt,
            inactiveAt: inactiveAt,
            userEmail: userEmail,
            userId: userId,
            active: active,
            locationId: locationId
        })

        // console.log(docRef.id)
        // setDocId(docRef.id)

        setActiveAtLocation(true)

        // make sure user cant add twice
        // update on add
        // only get active users
        // invalidate on time

    }




    useEffect(() => {
        getActiveUsers()
        // if (users.includes(auth.currentUser.email)) {
        //     setActiveAtLocation(true)
        // }
        // console.log(users)


    }, [activeAtLocation])


    return (
        <Center>
            <VStack>
                <Center h='5' w='20' />

                <Heading>{location.name}</Heading>
                <Text >{location.address}, {location.city}, {location.state}</Text>

                <Center h='10' w='20' />


                <Heading size="md" >Currently {users.length} people here </Heading>

                {/* {
                    users.map(user => {
                        return <Text key={Math.random() * 100000} >{user}</Text>
                    })
                } */}

                {
                    activeAtLocation && <Heading size="sm">You are currently active at this location.</Heading>
                }


                <Center h='10' w='20' />

                {
                    !activeAtLocation &&

                    <Button onPress={() => addActiveUser()} colorScheme={"indigo"} >Join this Location</Button>
                }

                {
                    activeAtLocation &&
                    <Button onPress={() => deleteActiveUser()} colorScheme={"indigo"} >Done? Leave this Location</Button>

                }



                <Center h='2' w='20' />

                <Center>
                    <Text underline onPress={() => openInMaps()}>Open Maps</Text>
                </Center>
            </VStack>
        </Center>
    )
}