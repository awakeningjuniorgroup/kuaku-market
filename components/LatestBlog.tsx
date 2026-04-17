import React from "react";
import { Title } from "./text";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();

  return (
    <div className="mb-10 lg:mb-20">
      <Title>Dernier blog</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
        {blogs?.map((blog) => (
          <Link
            key={blog?._id}
            href={`/blog/${blog?.slug?.current}`}
            className="block rounded-lg overflow-hidden"
          >
            {blog?.mainImage && (
              <Image
                src={urlFor(blog?.mainImage).url()}
                alt={blog?.title || "Blog image"}
                width={500}
                height={500}
                className="w-full max-h-80 object-cover"
              />
            )}
            <div className="bg-shop_light_bg p-5">
              <div className="text-xs flex items-center gap-5">
                <div className="flex items-center relative group cursor-pointer">
                  {blog?.blogcategories?.map((item) => (
                    <p
                      key={item._id || item.title}
                      className="font-semibold text-shop_dark_green tracking-wider"
                    >
                      {item?.title}
                    </p>
                  ))}
                  <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hover:cursor-pointer hoverEffect" />
                </div>
                <p className="flex items-center gap-1 text-lightColor relative group hover:cursor-pointer hover:text-shop_dark_green hoverEffect">
                  <Calendar size={15} />{" "}
                  {blog.publishedAt
                    ? dayjs(blog.publishedAt).format("MMMM D, YYYY")
                    : "Date not available"}
                  <span className="absolute left-0 -bottom-1.5 bg-lightColor/30 inline-block w-full h-[2px] group-hover:bg-shop_dark_green hoverEffect" />
                </p>
              </div>
              <h3 className="text-base font-semibold tracking-wide mt-5 line-clamp-2 hover:text-shop_dark_green hoverEffect">
                {blog?.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;
