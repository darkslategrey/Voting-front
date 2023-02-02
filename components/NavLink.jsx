import {
  Link as ChakraLink,
  LinkProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

// from https://dev.to/kennymark/implementing-activelink-in-next-js-and-chakra-44ki
//
const NavLink = ({ to, activeProps, children, _hover, ...props }) => {
  const router = useRouter();
  const isActive = router.pathname === to;
  const color = useColorModeValue("white", "selected");

  if (isActive) {
    return (
      <Link href={to}>
        <Text
          fontWeight="bold"
          {...props}
          {...activeProps}
          _hover={{ color: "selected" }}
          color={color}
        >
          {children}
        </Text>
      </Link>
    );
  }

  return (
    <Link href={to}>
      <Text {...props} _hover={{ color: "selected" }}>
        {children}
      </Text>
    </Link>
  );
};

export default NavLink;
