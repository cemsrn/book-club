import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import UsersView from "@/views/UsersView.vue";
import UserView from "@/views/UserView.vue";
import BooksView from "@/views/BooksView.vue";
import BookEditView from "@/views/BookEditView.vue";
import BookAddView from "@/views/BookAddView.vue";
import DashboardView from "@/views/DashboardView.vue";
import BookDetailsView from "@/views/BookDetailsView.vue";
import BorrowBooksView from "@/views/BorrowBooksView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/users",
      name: "users",
      component: UsersView,
    },
    {
      path: "/users/:id",
      name: "user",
      component: UserView,
    },
    {
      path: "/users/:userId/borrow",
      name: "BorrowBooks",
      component: BorrowBooksView,
    },
    {
      path: "/books",
      name: "books",
      component: BooksView,
    },
    {
      path: "/books/:id/edit",
      name: "edit-book",
      component: BookEditView,
    },
    {
      path: "/books/:id",
      name: "book-details",
      component: BookDetailsView,
    },
    {
      path: "/books/add",
      name: "book-add",
      component: BookAddView,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
    },
  ],
});

export default router;
