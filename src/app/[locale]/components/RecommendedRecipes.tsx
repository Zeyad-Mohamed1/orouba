"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Recipe } from "@/types/recipes";

export default function RecommendedRecipes() {
  const { locale } = useParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(false);

  // Fetch recipes if not provided as props
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/recipes?recommended=true&limit=8`);

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommended recipes:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []); // Empty dependency array to run only once on mount

  const nextSlide = () => {
    if (recipes.length <= 3) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === recipes.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (recipes.length <= 3) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 3 : prevIndex - 1
    );
  };

  // Return null if no recipes after loading
  if (!loading && (recipes.length === 0 || error)) {
    return null;
  }

  // Show loading skeleton while fetching
  if (loading) {
    return (
      <div className="my-12">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {locale === "ar" ? "وصفات موصى بها" : "Recommended Recipes"}
        </h2>
        <Link
          href={`/${locale}/recipes`}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors"
        >
          {locale === "ar" ? "عرض الكل" : "View All"}
        </Link>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {recipes.map((recipe) => (
              <div key={recipe.id} className="min-w-[33.333%] px-2">
                <Link href={`/${locale}/recipes/${recipe.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <div className="relative h-56 w-full">
                      <Image
                        src={recipe.image}
                        alt={
                          locale === "ar"
                            ? recipe.dish.name_ar
                            : recipe.dish.name_en
                        }
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        {recipe.level}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 text-gray-800">
                        {locale === "ar"
                          ? recipe.dish.name_ar
                          : recipe.dish.name_en}
                      </h3>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>
                            {parseInt(recipe.prep_time) +
                              parseInt(recipe.cooking_time)}{" "}
                            mins
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>{recipe.servings}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {recipes.length > 3 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 rounded-full p-3 shadow-lg z-10 hover:bg-blue-50 transition-colors"
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-blue-600 rounded-full p-3 shadow-lg z-10 hover:bg-blue-50 transition-colors"
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
