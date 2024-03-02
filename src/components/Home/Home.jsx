import { Button, Center, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { BsTools } from "react-icons/bs";
import { LuInspect } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Center h={"100vh"}>
      <Stack direction={"column"} spacing={4}>
        <Text as={"i"} color="gray" fontSize="xl" align={"center"}>
          Choose the Version
        </Text>
        <Stack direction="row" spacing={4}>
          <Button
            onClick={() => navigate("/sdk")}
            leftIcon={<BsTools />}
            colorScheme="teal"
          >
            SDK Quickstart
          </Button>
          <Button
            onClick={() => navigate("/ui-kit")}
            leftIcon={<LuInspect />}
            colorScheme="teal"
          >
            UI Kit Quickstart
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}
