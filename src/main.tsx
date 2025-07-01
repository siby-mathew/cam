import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Scanner } from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/index.ts";
import { AppLayout } from "./layouts/main.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <AppLayout>
        <Scanner />
      </AppLayout>
    </ChakraProvider>
  </StrictMode>
);
