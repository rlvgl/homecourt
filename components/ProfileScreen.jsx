import React, { useState, useEffect } from 'react'
import { Box, Text, Heading, VStack, HStack, Center, Skeleton, FormControl, Input, Button, Link, Stack } from 'native-base'

import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore'
import { db, app } from '../App'
import { getAuth } from 'firebase/auth'


export default ProfileScreen = ({ navigation, route }) => {
    const [user, setUser] = useState({})
    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [email, setEmail] = useState(user.email)

    const auth = getAuth(app)
    const userEmail = auth.currentUser.email
    const userId = auth.currentUser.uid



    useEffect(() => {
        const getUser = async () => {
            const q = query(collection(db, 'users'), where('email', '==', userEmail))
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach(doc => {
                setUser(doc.data())
            })
        }

        getUser()

    }, [])

    return (

        <Center>

            <Center h='10' w='20' />

            <VStack>

                <HStack space={2}>
                    <Stack w="40%">
                        <FormControl>
                            <FormControl.Label>First Name:</FormControl.Label>
                            <Input isDisabled={true} value={user.firstName} onChangeText={setFirstName} />
                        </FormControl>
                    </Stack>

                    <Stack w="40%">
                        <FormControl>
                            <FormControl.Label>Last Name:</FormControl.Label>
                            <Input isDisabled={true} value={user.lastName} onChangeText={setLastName} />
                        </FormControl>
                    </Stack>


                </HStack>

                <Center h='3' w='20' />

                <Center>
                    <FormControl>
                        <FormControl.Label>Email:</FormControl.Label>
                        <Input isDisabled={true} type="email" value={user.email} onChangeText={setEmail} />
                    </FormControl>
                </Center>

                {/* <Center h='10' w='20' />
                <Center>
                    <Button onPress={() => updateUser()} >Change Info</Button>
                </Center> */}

            </VStack>



        </Center >

    )
}