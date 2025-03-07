<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import getBook from "@/api/Books/getBook";
import updateBook from "@/api/Books/updateBook";
import BookForm from "@/components/bookComponents/BookForm.vue";
import BackButton from "@/components/bookComponents/BackButton.vue";
import StatusMessage from "@/components/bookComponents/StatusMessage.vue";

const router = useRouter();
const route = useRoute();
const bookId = route.params.id;

const book = ref({
  name: "",
  image: "",
  language: "",
  isbn: "",
  user_id: null,
  price: "",
  status: false,
  author: "",
  publishing_house: "",
});

const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const successMessage = ref("");

const fetchBook = async () => {
  loading.value = true;
  error.value = null;

  try {
    const bookData = await getBook(bookId);
    book.value = bookData;
  } catch (err) {
    error.value = `Failed to load book: ${err.message}`;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push("/books");
};

const saveBook = async () => {
  saving.value = true;
  error.value = null;
  successMessage.value = "";

  try {
    // Convert price to number if it's a string
    const bookData = {
      ...book.value,
      price: Number(book.value.price) || 0,
    };

    await updateBook(bookId, bookData);
    successMessage.value = "Book updated successfully!";

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (err) {
    error.value = `Failed to update book: ${err.message}`;
    console.error(err);
  } finally {
    saving.value = false;
  }
};

// Fetch book data when component is mounted
onMounted(fetchBook);
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <BackButton @click="goBack">Back to Books</BackButton>

    <h1 class="text-4xl font-bold text-center text-blue-800 mb-8">Edit Book</h1>

    <StatusMessage v-if="error" type="error" :message="error" />
    <StatusMessage
      v-if="successMessage"
      type="success"
      :message="successMessage"
    />

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center my-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <!-- Book Form - Only show when not loading -->
    <BookForm
      v-if="!loading"
      :book="book"
      :is-loading="saving"
      mode="edit"
      @submit="saveBook"
      @cancel="goBack"
    />
  </div>
</template>
