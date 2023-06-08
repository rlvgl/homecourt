import React, { useState, useEffect } from 'react'
import { Text, Heading, Center, Button, FormControl, VStack, Box, Stack, Input, Link, HStack } from 'native-base'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'


export default AddLocationScreen = ({ location, route }) => {
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [areaCode, setAreaCode] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false)



    const addLocation = async () => {
        if (await verifyData()) {
            //check that doc with same address doesnt exist
            const q = query(collection(db, "gyms"), where("address", "==", address.replace(/\s+/g, '')))
            const querySnapshot = await getDocs(q)
            if (querySnapshot.length > 0) {
                setError(true)
                setErrorMessage("Address already exists")
            }


            else {
                const docRef = await addDoc(collection(db, "gyms"), {
                    name: name,
                    address: address,
                    city: city,
                    state: state,
                    areaCode: areaCode,
                    timeCreated: new Date(),
                    lastUpdated: new Date(),
                })
                console.log(docRef.id)
                setError(false)
                setSuccess(true)
            }


        }

        else {
            console.log("error has occured with data")
            setError(true)
            setErrorMessage("form not filled correctly")
        }

    }


    const verifyData = async () => {
        if (name.length == 0) return false
        if (address.length == 0) return false
        if (city.length == 0) return false
        if (state.length == 0) return false
        return true
    }

    return (

        <Center w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                    color: "warmGray.50"
                }}>
                    Add A New Location
                </Heading>

                <Heading mt="1" _dark={{
                    color: "warmGray.200"
                }} color="coolGray.600" fontWeight="medium" size="xs">
                    Add your own park or gym to HomeCourt
                </Heading>

                <VStack space={3} mt="5">


                    <FormControl isRequired>
                        <FormControl.Label>Park/Gym Name</FormControl.Label>
                        <Input placeholder={"Silver Creek Linear Park "} onChangeText={setName} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormControl.Label>Address</FormControl.Label>
                        <Input placeholder={'Silver Creek Rd & Greenyard St'} onChangeText={setAddress} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormControl.Label>City</FormControl.Label>
                        <Input placeholder={'San Jose'} onChangeText={setCity} />
                    </FormControl>

                    <FormControl isRequired>
                        <FormControl.Label>State</FormControl.Label>
                        <Input placeholder={"California"} onChangeText={setState} />
                    </FormControl>

                    <FormControl>
                        <FormControl.Label>Area Code</FormControl.Label>
                        <Input placeholder={'95121'} onChangeText={setAreaCode} />
                    </FormControl>



                    <Button mt="2" colorScheme="indigo" onPress={() => addLocation()} >
                        Add Park +
                    </Button>

                    {
                        error &&
                        <Text colorScheme="error">Error: {errorMessage}.</Text>
                    }

                    {
                        success &&
                        <Text colorScheme="success">Added location to database</Text>
                    }


                </VStack>
            </Box>
        </Center>

    )
}