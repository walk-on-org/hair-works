"use client";
import Link from "next/link";
import {
  HomeIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import ThemeSwitch from "../ThemeSwitch";
import NotificationMenu from "../NotificationMenu";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const togglePagesMenu = () => {
    setIsPagesMenuOpen(!isPagesMenuOpen);
  };
  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };
  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  const menuList = [
    {
      title: "ダッシュボード",
      link: "/admin/dashboard",
      children: [],
    },
    {
      title: "法人",
      link: "/admin/corporations",
      children: [],
    },
    {
      title: "マスタ設定",
      link: "",
      children: [
        {
          title: "職種",
          link: "/admin/setting/job_categories",
        },
        {
          title: "役職/役割",
          link: "/admin/setting/positions",
        },
      ],
    },
  ];

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSideMenuOpen ? "overflow-hidden" : ""
      }`}
    >
      <aside className="z-20 hidden w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0">
        <div className="py-4 text-gray-500 dark:text-gray-400">
          <a
            className="ml-6 text-base flex flex-col font-bold text-gray-800 dark:text-gray-200"
            href="#"
          >
            <span>ヘアワークス</span>
            <span className="text-sm">事業所様管理サイト</span>
          </a>
          <ul className="mt-6">
            <li className="relative px-6 py-3">
              <span
                className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                aria-hidden="true"
              ></span>
              <Link
                className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                href={"/admin/dashboard"}
              >
                <HomeIcon className="w-5 h-5" />
                <span className="ml-4">ダッシュボード</span>
              </Link>
            </li>
            <li className="relative px-6 py-3">
              <Link
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                href={"/admin/corporations"}
              >
                <BuildingOffice2Icon className="w-5 h-5" />
                <span className="ml-4">法人</span>
              </Link>
            </li>
            <li className="relative px-6 py-3">
              <button
                className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                aria-haspopup="true"
                onClick={togglePagesMenu}
              >
                <span className="inline-flex items-center">
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span className="ml-4">マスタ</span>
                </span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              {isPagesMenuOpen && (
                <ul
                  className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                  aria-label="submenu"
                >
                  <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                    <Link
                      className="w-full"
                      href={"/admin/setting/job_categories"}
                    >
                      職種
                    </Link>
                  </li>
                  <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                    <Link className="w-full" href={"/admin/setting/positions"}>
                      役職/役割
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
          onClick={closeSideMenu}
        ></div>
      )}
      {isSideMenuOpen && (
        <aside className="fixed inset-y-0 z-20 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden">
          <div className="py-4 text-gray-500 dark:text-gray-400">
            <a
              className="ml-6 text-lg flex flex-col font-bold text-gray-800 dark:text-gray-200"
              href="#"
            >
              <span>ヘアワークス</span>
              <span className="text-sm">事業所様管理サイト</span>
            </a>
            <ul className="mt-6">
              <li className="relative px-6 py-3">
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                  aria-hidden="true"
                ></span>
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold text-gray-800 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 dark:text-gray-100"
                  href={"/admin/dashboard"}
                >
                  <HomeIcon className="w-5 h-5" />
                  <span className="ml-4">ダッシュボード</span>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  href={"/admin/corporations"}
                >
                  <BuildingOffice2Icon className="w-5 h-5" />
                  <span className="ml-4">法人</span>
                </Link>
              </li>
              <li className="relative px-6 py-3">
                <button
                  className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={togglePagesMenu}
                  aria-haspopup="true"
                >
                  <span className="inline-flex items-center">
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="ml-4">マスタ</span>
                  </span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                {isPagesMenuOpen && (
                  <ul
                    className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                    aria-label="submenu"
                  >
                    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                      <Link
                        className="w-full"
                        href={"/admin/setting/job_categories"}
                      >
                        職種
                      </Link>
                    </li>
                    <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                      <Link
                        className="w-full"
                        href={"/admin/setting/positions"}
                      >
                        役職/役割
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </aside>
      )}
      <div className="flex flex-col flex-1 w-full">
        <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
          <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
            {/* Mobile hamburger */}
            <button
              className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
              onClick={toggleSideMenu}
              aria-label="Menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            {/* Search input */}
            <div className="flex justify-center flex-1 lg:mr-32">
              <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                <div className="absolute inset-y-0 flex items-center pl-2">
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </div>
                <input
                  className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                  type="text"
                  placeholder="Search for projects"
                  aria-label="Search"
                />
              </div>
            </div>
            <ul className="flex items-center flex-shrink-0 space-x-6">
              {/* Theme toggler */}
              <li className="flex">
                <ThemeSwitch />
              </li>
              {/* Notifications menu */}
              <li className="relative">
                <NotificationMenu />
              </li>
            </ul>
          </div>
        </header>
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">{children}</div>
        </main>
      </div>
    </div>
  );
}
