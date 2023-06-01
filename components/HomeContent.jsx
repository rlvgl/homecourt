import React, { useState, useEffect } from 'react';
import { Heading, Text, Box, Stack, Center, HStack, VStack, Button, FormControl, Icon, Pressable } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'


import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../App'



export default HomeContent = ({ navigation, route }) => {
    const [selected, setSelected] = useState(1)
    const [gyms, setGyms] = useState([])

    useEffect(() => {

        // navigation.navigate("Add Location")
        const getAllGyms = async () => {
            const querySnapshot = await getDocs(collection(db, 'gyms'))
            let data = []
            querySnapshot.forEach(doc => {
                data.push(doc.data())
            })

            setGyms(data)
        }

        getAllGyms()

    }, [])

    const goToAddLocationPage = () => {
        navigation.navigate("Add Location")
    }

    return (
        <Box>


            <Center h='5' w='20' />

            <Heading>
                Locations Near You

            </Heading>

            <Center h='10' w='20' />


            <VStack space={4}>

                {
                    gyms.map(gym => {
                        return <Box alignItems="center" key={gym.name}>
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
                                    {/* <Text fontWeight="400">

                                    </Text> */}
                                    <HStack alignItems="center" space={4} justifyContent="space-between">
                                        <HStack alignItems="center">
                                            <Text color="coolGray.600" _dark={{
                                                color: "warmGray.200"
                                            }} fontWeight="400">
                                                Active
                                            </Text>
                                        </HStack>
                                    </HStack>
                                </Stack>
                            </Box>
                        </Box>;
                    })

                }

                <Button onPress={() => goToAddLocationPage()} colorScheme={"indigo"}>Add Location +</Button>

            </VStack>
            {/* <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6} w="100%">
                <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={() => setSelected(0)}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Home
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(1)}>
                    <Center>
                        <Icon mb="1" as={<MaterialIcons name="search" />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Search
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={selected === 2 ? 'cart' : 'cart-outline'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Cart
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} color="white" size="sm" />
                        <Text color="white" fontSize="12">
                            Account
                        </Text>
                    </Center>
                </Pressable>
            </HStack> */}
        </Box>
    )
}  