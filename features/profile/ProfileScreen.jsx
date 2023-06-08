import React, { useState, useEffect } from 'react'
import { Divider, Box, Text, Heading, VStack, HStack, Center, Skeleton, FormControl, Spinner, InputGroup, Input, InputLeftAddon, Button, TextArea, Link, Stack, Flex, Spacer, Avatar, Select } from 'native-base'

import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore'
import { db, app } from '../../firebase'
import { getAuth } from 'firebase/auth'


/* 
THINGS:
*- WHY DOESNT AVATAR WORK ?????
*- ADD SKELETON TO PROFILE
*- make profile edits straight on instead of new form
!- Make avatar based on name split on space and taken first initial

*/

export default ProfileScreen = ({ navigation, route }) => {
    const [loadingUser, setLoadingUser] = useState(true)
    const [inEditMode, setInEditMode] = useState(false)
    const [error, setError] = useState("")

    const [user, setUser] = useState({})
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [username, setUsername] = useState(user.username)
    const [userBio, setUserBio] = useState(user.description)
    const [dateCreated, setDateCreated] = useState("")
    const [highestLevel, setHighestLevel] = useState("")

    const monthMapper = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }

    // ? for when including auth
    const auth = getAuth(app)
    const userEmail = auth.currentUser.email
    const userId = auth.currentUser.uid

    //? for development: mike@hotmail.com
    // const userEmail = "mike@hotmail.com"
    // const userId = "UZ2v0yK8QtOTxH8qlIr3cWeKrPw2"

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
    }, [])

    const getAvatarInitials = () => {
        const tokens = name.split(" ")
        let initials = ""
        tokens.forEach(token => {
            initials += token[0]
        })
        return initials
    }

    return (

        <Center p="5" w="100%" >


            {
                !loadingUser &&

                <VStack space={4} minW="100%">


                    {
                        !inEditMode &&

                        <VStack space={3}>

                            {/* Avatar and edit button */}
                            <Flex direction="row">
                                < Avatar bg="indigo.500">{getAvatarInitials()}</Avatar>
                                <Spacer />
                                <Button size="sm" variant="link" onPress={() => setInEditMode(true)} colorScheme="indigo" >Edit Profile</Button>
                            </Flex>

                            {/* Profile headers */}
                            <Flex direction="row">
                                <VStack space={1}>
                                    <Text italic fontSize="md" color="gray.400" >Diamond League</Text>
                                    <VStack>
                                        <Heading size="xl">{name} {user.isInfluencer && "🏀"} </Heading>
                                        <Text color="gray.400" >@{username}</Text>
                                    </VStack>
                                </VStack>
                                <Spacer />
                            </Flex>

                            <Flex direction="row" >
                                <Text color="gray.600" >{userBio}</Text>
                            </Flex>

                            <HStack space={8}>
                                <Text color="gray.400" italic fontSize="xs">Played {highestLevel}</Text>
                                <Text color="gray.400" italic fontSize="xs">Joined {monthMapper[dateCreated.slice(5, 7)]} {dateCreated.slice(0, 4)}</Text>
                            </HStack>


                            {/* <Divider orientation="horizontal" /> */}

                        </VStack>
                    }


                    {
                        inEditMode &&
                        <VStack space={4}>

                            {/* Avatar and edit button */}
                            <Flex direction="row">
                                < Avatar bg="indigo.500">MJ</Avatar>
                                <Spacer />
                                <HStack>

                                    <Button colorScheme="indigo" size="sm" variant="link" onPress={() => cancelChanges()}>Cancel Edits</Button>
                                    <Button colorScheme="indigo" size="sm" variant="link" onPress={() => submitUserChanges()}>Save Changes</Button>
                                </HStack>
                            </Flex>

                            {/* Profile headers */}
                            <Flex direction="row">
                                <VStack space={1}>
                                    <Text italic fontSize="md" color="gray.400" >Diamond League</Text>
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

                            <HStack space={8}>
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
                    {/* 
                    <Divider orientation="horizontal" />

                    <VStack p="3" space={0}>
                        <Center h={150}>
                            <Text>Avatar goes here</Text>
                        </Center>
                        <Divider />
                        <HStack>
                            <VStack>
                                <Text fontSize="md" italic>Rating</Text>
                                <Text fontSize="3xl" bold>1920</Text>
                            </VStack>
                            <Spacer />
                            <VStack>
                                <Flex direction="row-reverse">
                                    <Text fontSize="md" italic>League</Text>
                                </Flex>
                                <Text fontSize="3xl" bold>Diamond</Text>
                            </VStack>
                        </HStack>
                        <VStack p="3" space={3}>

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
                                    <Text fontSize="xl" bold>40</Text>
                                </VStack>

                            </HStack>
                        </VStack>
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