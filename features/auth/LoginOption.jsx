import React, { useState, useEffect } from 'react';
import { Button, Text, Heading, Box, Input, FormControl, Stack, VStack, Center, Link, HStack } from 'native-base'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

import { app, db } from '../../firebase'
import { addDoc, collection, setDoc, doc } from 'firebase/firestore'
import { navigateToProfile } from '../../utils'

export default LoginOption = ({ setUser, navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const auth = getAuth()
    const handleAuth = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                // navigateToProfile(navigation, result.user.email, result.userUid, result.user)

            })
            .catch(err => {
                createUserWithEmailAndPassword(auth, email, password)
                    .then(result => {
                        const userUid = result.user.uid
                        const email = result.user.email

                        // doc will have id of user auth id and filler name and time created/updated
                        const userRef = doc(db, "users", userUid)
                        const autoUsername = "Guest#" + (Math.random().toString(36).substring(2, 10)).toString()
                        setDoc(userRef, {
                            isInfluencer: false,
                            name: "Anonymous Hooper",
                            bio: "Hi! I am a HomeCourt user",
                            timeCreated: new Date(),
                            lastUpdated: new Date(),
                            email: email,
                            username: autoUsername,
                            highestLevel: "Rec",
                        })



                    })
                    .catch(err => {
                        console.log(err)
                        setError(true)
                        setErrorMessage("Email is not valid")
                    })

            })
    }

    styles = {
        centerScreen: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        },

        formField: {
            marginBottom: 50
        }
    }

    return (
        <Box style={styles.centerScreen}>

            <Box >

                <Center w="64" h="20" />

                <Center>
                    <Heading size="2xl">HomeCourt 🏀</Heading>

                    <Center w="20" h='1' />

                    <Heading mt="1" _dark={{
                        color: "warmGray.200"
                    }} color="coolGray.600" fontWeight="medium" size="xs">
                        Sign in or register below to continue!
                    </Heading>
                </Center>

                <Center w="30" h="10" />




                <VStack space={3} mt="5">
                    <FormControl>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input onChangeText={setEmail} type="email" placeholder="Email" />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input type="password" onChangeText={setPassword} placeholder="Password" />
                    </FormControl>

                    <Center h='1' w='20' />
                    <Button mt="2" colorScheme="indigo" onPress={() => handleAuth()} >
                        Sign in or Register
                    </Button>
                    {
                        error &&
                        <Text colorScheme={"error"}>Error has occured with login, please try again.</Text>
                    }
                </VStack>
            </Box>


        </Box >
    )
}

styles = {
    centerScreen: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    formField: {
        marginBottom: 50
    }
}
