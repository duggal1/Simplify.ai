import { notFound } from 'next/navigation';

export default function BlogPost({ params }: { params: { slug: string[] } }) {
  // Here you would fetch the blog post data using the slug
  // For now, we'll just display the slug
  const fullSlug = params.slug.join('/');
  
  if (!fullSlug) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1>Blog Post: {fullSlug}</h1>
      {/* Add your blog post display logic here */}
    </div>
  );
} 