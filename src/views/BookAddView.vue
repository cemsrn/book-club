<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import addNewBook from "@/api/Books/addNewBook";
import BookForm from "@/components/bookComponents/BookForm.vue";
import BackButton from "@/components/bookComponents/BackButton.vue";
import StatusMessage from "@/components/bookComponents/StatusMessage.vue";

const router = useRouter();
const defaultImage = "https://loremflickr.com/640/480/nature";

// Form state
const book = ref({
  name: "",
  image: defaultImage,
  language: "English",
  isbn: "",
  user_id: 1,
  price: "",
  status: false,
  author: "",
  publishing_house: "",
});
const saving = ref(false);
const error = ref(null);
const successMessage = ref("");

function goBack() {
  router.push("/books");
}

async function saveBook() {
  if (saving.value) return;

  saving.value = true;
  error.value = null;
  successMessage.value = "";

  try {
    const bookData = {
      ...book.value,
      price: Number(book.value.price) || 0,
      isbn: book.value.isbn || Math.floor(10000 + Math.random() * 90000),
    };

    await addNewBook(bookData);
    successMessage.value = "Book added successfully!";

    // Reset form
    book.value = {
      name: "",
      image: defaultImage,
      language: "English",
      isbn: "",
      user_id: 1,
      price: "",
      status: false,
      author: "",
      publishing_house: "",
    };

    // Go back to books page after a moment
    setTimeout(() => router.push("/books"), 1500);
  } catch (err) {
    error.value = `Failed to add book: ${err.message}`;
    console.error("Error adding book:", err);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <BackButton @click="goBack">Back to Books</BackButton>

    <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">
      Add New Book
    </h1>

    <StatusMessage v-if="error" type="error" :message="error" />
    <StatusMessage
      v-if="successMessage"
      type="success"
      :message="successMessage"
    />

    <BookForm
      :book="book"
      :is-loading="saving"
      mode="add"
      @submit="saveBook"
      @cancel="goBack"
    />
  </div>
</template>
