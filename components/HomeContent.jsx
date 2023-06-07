import React, { useState, useEffect } from 'react';
import { Heading, Text, Box, Stack, Center, HStack, VStack, Button, FormControl, Icon, Pressable } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import LocationDetailScreen from './LocationDetailScreen'


import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'



export default HomeContent = ({ navigation, route }) => {
    const [selected, setSelected] = useState(1)
    const [gyms, setGyms] = useState([])

    useEffect(() => {

        // navigation.navigate("Add Location")
        const getAllGyms = async () => {
            const querySnapshot = await getDocs(collection(db, 'gyms'))
            let data = []
            querySnapshot.forEach(doc => {
                const toPush = doc.data()
                toPush["locationId"] = doc.id
                data.push(toPush)
                // data.push({doc.id, doc.data()...})
            })

            setGyms(data)
        }

        getAllGyms()

    }, [])

    const goToAddLocationPage = () => {
        navigation.navigate("Add Location")
    }

    const goToLocationDetailPage = (location) => {
        // console.log(location)
        navigation.navigate("Location Detail", { location: location })
    }

    return (
        <Box>


            <Center h='5' w='20' />

            <Heading>
                Locations Near You

            </Heading>

            <Center h='5' w='20' />


            <VStack space={4}>
                <Button onPress={() => goToAddLocationPage()} colorScheme={"indigo"}>Add Location +</Button>

                {
                    gyms.map(gym => {
                        return <Box alignItems="center" key={gym.name} onPress={() => goToLocationDetailPage(gym)} >
                            <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
                                borderColor: "coolGray.600",
                                backgroundColor: "gray.700"
                            }} _web={{
                                shadow: 2,
                                borderWidth: 0
                            }} _light={{
                                backgroundColor: "gray.50"
                            }}>

                                <Stack p="4" space={3}>
                                    <Stack space={2}>
                                        <Heading size="md" ml="-1">
                                            {gym.name}
                                        </Heading>
                                        <Text fontSize="xs" _light={{
                                            color: "violet.500"
                                        }} _dark={{
                                            color: "violet.400"
                                        }} fontWeight="500" ml="-0.5" mt="-1">
                                            {gym.address}, {gym.city}, {gym.state}
                                        </Text>
                                    </Stack>
                                    <HStack alignItems="center" space={4} justifyContent="space-between">
                                        <HStack alignItems="center">
                                            <Button size="xs" colorScheme={"indigo"} onPress={() => goToLocationDetailPage(gym)} w='60%' >
                                                See More
                                            </Button>
                                        </HStack>
                                    </HStack>
                                </Stack>
                            </Box>
                        </Box>;
                    })

                }


            </VStack>
        </Box>
    )
}  