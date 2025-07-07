import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-4xl text-dark-gray mb-4">Phụ huynh nói gì về chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những chia sẻ chân thành từ các bậc phụ huynh
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-light-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-bold text-4xl text-dark-gray mb-4">Phụ huynh nói gì về chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những chia sẻ chân thành từ các bậc phụ huynh
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-dark-gray">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex text-accent-yellow mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
