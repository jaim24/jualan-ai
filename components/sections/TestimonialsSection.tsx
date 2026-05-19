interface Testimonial {
  name: string;
  role?: string;
  content: string;
  avatar?: string;
}

interface TestimonialsProps {
  title?: string;
  items: Testimonial[];
}

export default function TestimonialsSection({ title, items }: TestimonialsProps) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {title && (
          <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
                &ldquo;{item.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-sm">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  {item.role && (
                    <p className="text-xs text-gray-500">{item.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
