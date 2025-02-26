import { View, Text } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { useClerk } from "@clerk/clerk-expo";
interface RedirectParams {
  status: "successful" | "cancelled";
  transaction_id?: string;
  tx_ref: string;
}

const paymentKey =  process.env.EXPO_PUBLIC_FLUTTERWAVE_KEY

export default function Payment({ amount }: { amount: number }) {
  const {user}= useClerk()
  const generateTransactionRef = (length: number) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
  };

  /* An example function called when transaction is completed successfully or canceled */
  const handleOnRedirect = (data: RedirectParams) => {
    console.log(data);
  };
  return (
    <>
      <PayWithFlutterwave
        onRedirect={handleOnRedirect}
        options={{
          tx_ref: generateTransactionRef(10),
          authorization: paymentKey!,
          customer: {
            email: user?.emailAddresses[0].emailAddress!, 
          },
          amount: amount,
          currency: "NGN",
          payment_options: "card",
        }}
        customButton={(props) => (
          <CustomButton
            title="Confirm Ride"
            style={{ marginVertical: 20 }}
            onPress={props.onPress}
            disabled={props.disabled}
          />
        )}
      />
    </>
  );
}
