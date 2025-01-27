import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
} from "react-native";
import { getDBConnection, addItem } from "@/db/db-service";

interface AddItemFormProps {
  onSubmit: (data: ItemFormData) => void;
}

interface ItemFormData {
  emoji: string;
  name: string;
  qty: number;
  qtyAlert: number;
}

export default function AddItemForm({ onSubmit }: AddItemFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormData>();
  const [submittedData, setSubmittedData] = useState<ItemFormData>({
    emoji: "",
    name: "",
    qty: 1,
    qtyAlert: 0,
  });

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message as String}</Text>
        )}
        {errors.emoji && (
          <Text style={styles.errorText}>{errors.emoji.message as String}</Text>
        )}
        <View style={styles.row}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Emoji"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="emoji"
            defaultValue=""
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.quarterInput]}
                placeholder="Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="name"
            defaultValue=""
          />
        </View>

        <View style={styles.row}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                value={value.toString()}
              />
            )}
            name="qty"
            defaultValue={1}
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity Alert"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                value={value.toString()}
              />
            )}
            name="qtyAlert"
            defaultValue={0}
          />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <MaterialIcons name="add" size={16} color="#25292e" />
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  input: {
    height: 40,
    borderColor: "#bca37c",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 13,
  },
  row: {
    flexDirection: "row",
  },
  quarterInput: {
    flex: 1,
    marginLeft: 5,
    width: 30,
  },
  halfInput: {
    flex: 1,
    marginRight: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#bca37c",
    borderRadius: 13,
    padding: 10,
    marginHorizontal: "35%",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
