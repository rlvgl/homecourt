import React, { useState, useEffect } from 'react'
import { Divider, Box, Text, Heading, VStack, HStack, Center, Skeleton, FormControl, Input, Button, Link, Stack, Flex, Spacer } from 'native-base'

import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore'
import { db, app } from '../../firebase'
import { getAuth } from 'firebase/auth'


export default ProfileScreen = ({ navigation, route }) => {
    const [user, setUser] = useState({})
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [email, setEmail] = useState(user.email)
    const [username, setUsername] = useState(user.username)
    const [dateCreated, setDateCreated] = useState("")
    const [error, setError] = useState("")

    const [inEditMode, setInEditMode] = useState(false)

    //? for when including auth
    // const auth = getAuth(app)
    // const userEmail = auth.currentUser.email
    // const userId = auth.currentUser.uid

    //? for development: mike@hotmail.com
    const userEmail = "mike@hotmail.com"
    const userId = "UZ2v0yK8QtOTxH8qlIr3cWeKrPw2"


    const validateUserChangesAreValid = async () => {
        // trim username and all fields
        // make sure no bad characters are used

        await setFirstName(firstName.trim())
        await setLastName(lastName.trim())
        await setUsername(username.trim())


        const strRegex = new RegExp(/^[a-z0-9]+$/i);
        if (!strRegex.test(firstName)) {
            setError("First name must be alphanumeric")
            return false
        }
        if (!strRegex.test(lastName)) {
            setError("Last name must be alphanumeric")
            return false
        }

        if (!strRegex.test(username)) {
            setError("Username must be alphanumeric")
            return false
        }


        await setUsername(username.trim())
        const usernameQuery = query(collection(db, "users"), where("username", "==", username))
        const querySnapshot = await getDocs(usernameQuery)
        let usernameExists = false
        querySnapshot.forEach(d => {
            usernameExists = true
        })

        if (usernameExists) {
            setError("Username already exists.",)
            return false
        }

        await setError("")
        return true
    }

    const submitUserChanges = async () => {
        setError("")

        // check if username is already taken
        // update all fields including last updated
        const changesAreValid = await validateUserChangesAreValid()
        if (!changesAreValid) {
            return
        } else {
            // all updates are valid and transaction should proceed
            await setDoc(doc(db, "users", userId), {
                firstName: firstName,
                lastName: lastName,
                username: username,
                lastUpdated: new Date(),
            }, { merge: true });
        }

        setInEditMode(false)

    }


    const getUser = async () => {
        const docRef = doc(db, "users", userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            await setUser(docSnap.data())
            await setFirstName(docSnap.data().firstName)
            await setLastName(docSnap.data().lastName)
            await setEmail(docSnap.data().email)
            const date = new Date(docSnap.data().timeCreated.toDate())
            await setDateCreated((date.toISOString()).slice(0, 10))
        }

    }

    const cancelChanges = async () => {
        setInEditMode(false)
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setUsername(user.username)
    }

    useEffect(() => {
        getUser()
    }, [])

    return (

        <Center>
            <Center h='10' w='20' />

            <VStack space={4}>

                {/* Profile Header  */}
                <Flex direction="row">
                    <VStack>
                        <Heading>Your Profile</Heading>
                        <Text italic color="gray.400" >Joined {dateCreated}</Text>
                    </VStack>
                    <Spacer />
                    {
                        !inEditMode &&
                        <Button size="sm" variant="link" onPress={() => setInEditMode(true)} >Edit Profile</Button>
                    }

                    {
                        inEditMode &&
                        <Button size="sm" variant="link" onPress={() => cancelChanges()}>Cancel Edits</Button>
                    }
                </Flex>

                {/* Main Profile Content  */}
                <VStack space={3}>

                    <Flex direction="row">
                        <Stack w="40%">
                            <FormControl isDisabled={!inEditMode} isReadOnly={!inEditMode}>
                                <FormControl.Label>First Name:</FormControl.Label>
                                <Input placeholder={user.firstName} onChangeText={setFirstName} />
                            </FormControl>
                        </Stack>

                        <Spacer />

                        <Stack w="40%">
                            <FormControl isDisabled={!inEditMode} isReadOnly={!inEditMode}>
                                <FormControl.Label>Last Name:</FormControl.Label>
                                <Input placeholder={user.lastName} onChangeText={setLastName} />
                            </FormControl>
                        </Stack>
                    </Flex>


                    <Center>
                        <FormControl isDisabled={!inEditMode} isReadOnly={!inEditMode} >
                            <FormControl.Label>Username:</FormControl.Label>
                            {/* cannot change email for now */}
                            <Input placeholder={user.username} onChangeText={setUsername} />
                        </FormControl>
                    </Center>


                    <Center>
                        <FormControl isDisabled isReadOnly >
                            <FormControl.Label>Email:</FormControl.Label>
                            {/* cannot change email for now */}
                            <Input type="email" value={user.email} onChangeText={setEmail} />
                        </FormControl>
                    </Center>
                </VStack>

                {
                    (error != "") &&
                    <Text color={"red.600"} >{error}</Text>

                }
                {/* Submit Profile Changes  */}
                <Button isDisabled={!inEditMode} onPress={() => submitUserChanges()} >Save Changes </Button>



            </VStack >
        </Center >

    )
}