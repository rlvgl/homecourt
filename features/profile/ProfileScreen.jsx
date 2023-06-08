import React, { useState, useEffect } from 'react'
import { Divider, Box, Text, Heading, VStack, HStack, Center, Skeleton, FormControl, Spinner, InputGroup, Input, InputLeftAddon, Button, TextArea, Link, Stack, Flex, Spacer, Avatar, Select } from 'native-base'

import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore'
import { db, app, storage } from '../../firebase'
import { getAuth } from 'firebase/auth'
import { ref, getStorage, uploadBytes, getDownloadURL, listAll } from 'firebase/storage'

import * as ImagePicker from 'expo-image-picker'
import ProfileHero from './ProfileHero'

import { monthMapper, getAvatarInitials } from '../../utils'

/* 
THINGS:
*- WHY DOESNT AVATAR WORK ?????
*- ADD SKELETON TO PROFILE
*- make profile edits straight on instead of new form
*- Make avatar based on name split on space and taken first initial
!- Banner ?



Big Work: 
- make dark mode and general theming

*/

export default ProfileScreen = ({ navigation, route }) => {

    // ? for when including auth
    const auth = getAuth(app)
    const userEmail = auth.currentUser.email
    const userId = auth.currentUser.uid

    //? for development: mike@hotmail.com
    // const userEmail = "mike@hotmaIL.COM"
    // const userId = "UZ2v0yK8QtOTxH8qlIr3cWeKrPw2"

    // profile page state
    const [loadingUser, setLoadingUser] = useState(true)
    const [inEditMode, setInEditMode] = useState(false)
    const [error, setError] = useState("")

    // firestore vars
    const [user, setUser] = useState({})
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [username, setUsername] = useState(user.username)
    const [userBio, setUserBio] = useState(user.description)
    const [dateCreated, setDateCreated] = useState("")
    const [highestLevel, setHighestLevel] = useState("")

    // storage vars
    const photoUri = `images/${userId}/profile/profilePicture`
    const [profilePictureURL, setProfilePictureURL] = useState("")

    const getUserProfilePicture = async () => {
        const storage = getStorage()
        const storageRef = ref(storage, photoUri)
        getDownloadURL(storageRef).then(url => {
            setProfilePictureURL(url)
        }).catch(e => { return }) // expecting error not found for new users
    }


    const changeProfilePicture = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 0.1,
        });

        if (result.canceled) {
            return
        }

        const storage = getStorage()
        const storageRef = ref(storage, photoUri)

        const img = await fetch(result.assets[0].uri)
        const bytes = await img.blob()

        await uploadBytes(storageRef, bytes)
        await getUserProfilePicture()
        setInEditMode(false)
    }



    // to add new user info: getUser, validateUserChangesAreValid, submitUserChanges, cancelChanges
    // AND CREATEUSERWITHEMAILANDPASSWORD IN LOGINOPTION.JSX 


    const validateUserChangesAreValid = async () => {
        // trim username and all fields
        // make sure no bad characters are used

        await setUsername(username.trim())
        await setName(name.trim())
        await setUserBio(userBio.trim())



        if (username.length == 0) {
            setUsername(user.username)
        }

        if (name.length == 0) {
            setName(user.name)
        }

        if (userBio.length == 0) {
            setUserBio(user.bio)
        }

        if (username == user.username && name == user.name && userBio == user.bio && highestLevel == user.highestLevel) {
            setError("No changes have been made")
            return false
            // cancelChanges()
        }
        const strRegex = new RegExp(/^[a-z0-9]+$/i);
        const regexWithSpaces = new RegExp(/^[\w\-\s]+$/);
        if (!regexWithSpaces.test(name)) {
            setError("Name must be alphanumeric")
            return false
        }

        if (!strRegex.test(username)) {
            setError("Username must be alphanumeric")
            return false
        }

        if (name.length >= 30) {
            setError("Name must be less than 30 characters")
            return false
        }

        if (username.length >= 20) {
            setError("Username must be less than 20 characters")
            return false
        }

        if (userBio.length > 250) {
            setError("Description must be less than 180 characters")
            return false
        }

        if (username == user.username) {
            await setError("")
            return true
        }


        await setUsername(username.trim())
        const usernameQuery = query(collection(db, "users"), where("username", "==", username))
        const querySnapshot = await getDocs(usernameQuery)
        let usernameExists = false
        querySnapshot.forEach(d => {
            if (d.data().userId != userId) usernameExists = true
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
                name: name,
                username: username,
                lastUpdated: new Date(),
                bio: userBio,
                highestLevel: highestLevel,
            }, { merge: true });
        }

        setInEditMode(false)

    }


    const getUser = async () => {
        const docRef = doc(db, "users", userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data()
            await setUser(data)
            await setName(data.name)
            await setEmail(data.email)
            await setUsername(data.username)
            await setUserBio(data.bio)
            await setHighestLevel(data.highestLevel)

            const date = new Date(data.timeCreated.toDate())
            await setDateCreated((date.toISOString()).slice(0, 10))

            await setLoadingUser(false)
        }

    }

    const cancelChanges = async () => {
        setInEditMode(false)
        setName(user.name)
        setUsername(user.username)
        setHighestLevel(user.highestLevel)
        setUserBio(user.bio)
    }



    useEffect(() => {
        getUser()
        getUserProfilePicture()
    }, [])



    return (

        <Center p="5" w="100%" >


            {
                !loadingUser &&

                <VStack space={4} minW="100%" pt={2} >


                    {
                        !inEditMode &&
                        <ProfileHero name={name} isUser={true} username={username} profilePictureURL={profilePictureURL} setInEditMode={setInEditMode} isInfluencer={user.isInfluencer} userBio={userBio} highestLevel={highestLevel} dateCreated={dateCreated} />
                    }


                    {
                        inEditMode &&

                        <VStack space={4}>

                            {/* Avatar and edit button */}
                            <Flex direction="row">
                                < Avatar bg="indigo.500" source={profilePictureURL ? { uri: profilePictureURL } : null}>{getAvatarInitials(name)}</Avatar>

                                <Spacer />
                                <HStack>

                                    <Button colorScheme="indigo" size="sm" variant="link" onPress={() => changeProfilePicture()}>Choose Image</Button>
                                    <Button colorScheme="indigo" size="sm" variant="link" onPress={() => cancelChanges()}>Cancel Edits</Button>
                                    <Button colorScheme="indigo" size="sm" variant="link" onPress={() => submitUserChanges()}>Save Changes</Button>
                                </HStack>
                            </Flex>

                            {/* Profile headers */}
                            <Flex direction="row">
                                <VStack space={1}>
                                    {/* <Text italic fontSize="md" color="gray.400" >Diamond League</Text> */}
                                    <Stack w="100%" space={3} >
                                        <Input size="2xl" width="100%" placeholder={user.name} onChangeText={setName}></Input>
                                        <InputGroup >

                                            <InputLeftAddon children={"@"} />
                                            <Input w="70%" placeholder={user.username} onChangeText={setUsername}></Input>
                                        </InputGroup>
                                    </Stack>
                                </VStack>
                                <Spacer />
                            </Flex>

                            <Flex direction="row" >
                                <TextArea h="20" w="100%" placeholder={userBio} onChangeText={setUserBio} ></TextArea>
                            </Flex>

                            <HStack space={8}  >
                                <Select minW="150" selectedValue={highestLevel} size="sm" onValueChange={val => setHighestLevel(val)} accessibilityLabel={"Highest Level Played"} >
                                    <Select.Item label="None" value="Rec" />
                                    <Select.Item label="HS JV" value="JV" />
                                    <Select.Item label="HS Varsity" value="Varsity" />
                                    <Select.Item label="JUCO" value="JUCO" />
                                    <Select.Item label="Division III" value="Division III" />
                                    <Select.Item label="Division II" value="Division II" />
                                    <Select.Item label="Division I" value="Division I" />
                                    <Select.Item label="International" value="Overseas" />
                                    <Select.Item label="NBA" value="League" />
                                </Select>
                                <Text color="gray.400" italic fontSize="xs">Joined {monthMapper[dateCreated.slice(5, 7)]} {dateCreated.slice(0, 4)}</Text>
                            </HStack>


                            {
                                (error != "") &&
                                <Text color="red.400">{error}</Text>
                            }




                        </VStack>
                    }

                    {/* <Divider />

                    <VStack>
                        <HStack space={4}>
                            <Text fontSize="sm" bold underline italic>Stats</Text>
                            <Divider orientation="vertical" />
                            <Text fontSize="sm" italic>Friends</Text>
                            <Divider orientation="vertical" />
                            <Text fontSize="sm" italic>Recent</Text>
                        </HStack>
                    </VStack>


                    <VStack space={5}>
                        <Divider orientation="horizontal" />

                        <HStack>
                            <VStack>
                                <Text fontSize="xs" italic>Rating</Text>
                                <Text fontSize="xl" bold>1920</Text>
                            </VStack>
                            <Spacer />
                            <VStack>
                                <Flex direction="row-reverse">
                                    <Text fontSize="xs" italic>League</Text>
                                </Flex>
                                <Text fontSize="xl" color={"darkBlue.400"} bold>Diamond</Text>
                            </VStack>
                        </HStack>

                        <HStack>
                            <VStack>
                                <Text fontSize="xs" italic>Games Played</Text>
                                <Text fontSize="xl" bold>102</Text>
                            </VStack>
                            <Spacer />
                            <VStack>
                                <Flex direction="row-reverse">
                                    <Text fontSize="xs" italic>1v1 Rating</Text>
                                </Flex>
                                <Text fontSize="xl" bold>Unrated</Text>
                            </VStack>

                        </HStack>

                        <HStack>
                            <VStack>
                                <Text fontSize="xs" italic>Games Won</Text>
                                <Text fontSize="xl" bold>62</Text>
                            </VStack>
                            <Spacer />
                            <VStack>
                                <Flex direction="row-reverse">
                                    <Text fontSize="xs" italic>Games Lost</Text>
                                </Flex>
                                <Flex direction="row-reverse">
                                    <Text fontSize="xl" bold>40</Text>
                                </Flex>
                            </VStack>

                        </HStack>
                    </VStack> */}


                </VStack >

            }


            {
                loadingUser &&
                <Spinner size="lg" />
            }

        </Center >

    )
}