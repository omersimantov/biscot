import { NextSeo, NextSeoProps } from "next-seo";

interface IHeadSeo extends NextSeoProps {
  title: string;
}

export const SEO = ({ title, description, ...props }: IHeadSeo): JSX.Element => {
  const pageTitle = title + " | Biscot";
  const truncatedDescription =
    description && description.length > 24 ? description.substring(0, 23) + "..." : description;

  const seoProps: IHeadSeo = {
    title: pageTitle,
    description: description ? truncatedDescription : "",
    ...props
  };

  return <NextSeo {...seoProps} />;
};

export default SEO;
