import { Center, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <Center h={"100vh"}>
      <Stack direction={"column"} align={"center"}>
        <Text as={"b"} color={"red"} fontSize={"6xl"}>
          ERR: 404
        </Text>
        <Text>
          Page not found.
          <Link
            onClick={() => navigate(-1)}
            marginLeft={"5px"}
            color="teal"
          >
            Go Back
          </Link>
        </Text>
      </Stack>
    </Center>
  );
}
