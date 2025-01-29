import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
} from "react-native";
import {
  getDBConnection,
  getCategories,
  Category,
  AddItem,
} from "@/db/db-service";

interface AddItemFormProps {
  onSubmit: (data: AddItem) => Promise<void>;
}

export default function AddItemForm({ onSubmit }: AddItemFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddItem>({
    defaultValues: {
      category_id: 1,
      name: "",
      qty: 1,
      qtyAlert: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await getDBConnection();
        const cats = await getCategories(db);
        setCategories(cats);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmitForm = async (data: AddItem) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message as String}</Text>
        )}

        <Controller
          control={control}
          name="category_id"
          rules={{ required: "Category is required" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onChange(Number(itemValue))}
              >
                {categories.map((category) => (
                  <Picker.Item
                    key={category.id}
                    label={category.name}
                    value={category.id}
                  />
                ))}
              </Picker>
            </View>
          )}
        />

        <Controller
          control={control}
          name="name"
          rules={{ required: "Name is required" }}
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <View style={styles.row}>
          <Controller
            control={control}
            name="qty"
            defaultValue={1}
            rules={{
              required: "Quantity is required",
              min: { value: 0, message: "Quantity must be positive" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                value={value.toString()}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="qtyAlert"
            defaultValue={0}
            rules={{
              required: "Alert quantity is required",
              min: { value: 0, message: "Alert quantity must be positive" },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Quantity Alert"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                value={value.toString()}
                keyboardType="numeric"
              />
            )}
          />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit(onSubmitForm)}>
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
    borderColor: "#bca37c",
    borderWidth: 1,
    marginBottom: 10,
    padding: 18,
    borderRadius: 13,
  },
  row: {
    flexDirection: "row",
  },
  halfInput: {
    flex: 1,
    marginRight: 5,
  },
  pickerContainer: {
    borderColor: "#bca37c",
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 10,
    overflow: "hidden",
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
