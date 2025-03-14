import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "@auth0/auth0-vue";
import HomeView from "../views/HomeView.vue";
import UsersView from "@/views/UsersView.vue";
import UserView from "@/views/UserView.vue";
import BooksView from "@/views/BooksView.vue";
import BookEditView from "@/views/BookEditView.vue";
import BookAddView from "@/views/BookAddView.vue";
import DashboardView from "@/views/DashboardView.vue";
import BookDetailsView from "@/views/BookDetailsView.vue";
import LoginView from "@/views/LoginView.vue";
import MemberProfileView from "@/views/MemberProfileView.vue";
import BorrowBooksView from "@/views/BorrowBooksView.vue";
import AvailableBooksView from "@/views/AvailableBooksView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/member-profile",
      name: "MemberProfile",
      component: MemberProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/available-books/:id",
      name: "AvailableBooks",
      component: AvailableBooksView,
      meta: { requiresAuth: true },
    },
    {
      path: "/users",
      name: "users",
      component: UsersView,
      beforeEnter: authGuard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/users/:id",
      name: "user",
      component: UserView,
      beforeEnter: authGuard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/books",
      name: "books",
      component: BooksView,
      beforeEnter: authGuard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/books/:id/edit",
      name: "edit-book",
      component: BookEditView,
      beforeEnter: authGuard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/books/:id",
      name: "book-details",
      component: BookDetailsView,
      beforeEnter: authGuard,
      meta: { requiresAuth: true },
    },
    {
      path: "/books/add",
      name: "book-add",
      component: BookAddView,
      beforeEnter: authGuard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/users/:userId/borrow",
      name: "BorrowBooks",
      component: BorrowBooksView,
      meta: { requiresAdmin: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAdmin: true, allowGuest: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: authGuard,
      meta: { requiresAdmin: true },
    },
  ],
});

export default router;
