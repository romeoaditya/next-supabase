import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import supabase from "@/lib/db";
import {IMenu, IMenuCartItem} from "@/types/menu";
import {Minus, Plus} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {toast} from "sonner";

const Kasir = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [cart, setCart] = useState<IMenuCartItem[]>([]);

  const handleClearCart = () => setCart([]);
  // Add to Cart
  const handleAddToCart = (menu: IMenu) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === menu.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === menu.id ? {...item, quantity: item.quantity + 1} : item
        );
      } else {
        return [...prevCart, {...menu, quantity: 1}];
      }
    });
  };

  // Increase quantity
  const increaseQty = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id && item.quantity > 1
            ? {...item, quantity: item.quantity - 1}
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Hitung total
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleContinuePayment = () => {
    if (cart.length !== 0) {
      toast.success("Payment Success", {
        position: "top-center",
      });
      handleClearCart();
    } else {
      toast.error("Cart is Empty", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    const fetchMenus = async () => {
      const {data, error} = await supabase.from("menus").select("*");
      if (error) console.log(error);
      else setMenus(data);
    };

    fetchMenus();
  }, [supabase]);
  return (
    <div className="flex">
      {/* Bagian Menu Kiri */}
      <div className="lg:w-[80%] md:w-[65%] h-screen overflow-y-scroll px-6 py-8 mr-[20%]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {menus.map((menu: IMenu) => (
            <Card>
              <Link href={`/menu/${menu.id}`} key={menu.id} className="w-full">
                <CardContent>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h4 className="font-semibold text-xl">{menu.name}</h4>
                      <p>{menu.category}</p>
                      <p className="font-semibold text-xl">${menu.price}.00</p>
                      <p className="text-md mt-4">Stok : 0</p>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <CardFooter>
                <Button
                  onClick={() => handleAddToCart(menu)}
                  variant={"outline"}
                  className="w-full font-bold cursor-pointer"
                  size={"lg"}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Panel Cashier Kanan */}
      <div className="fixed top-0 right-0 md:w-[35%] lg:w-[20%] h-screen bg-gray-90 flex flex-col justify-between p-4 shadow-lg">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold mb-5 border-b pb-2">Cashier</h1>

          {/* List Pesanan */}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="mt-5">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="size-7"
                  onClick={() => decreaseQty(item.id)}
                >
                  <Minus />
                </Button>
                <span className="min-w-[20px] text-center">
                  {item.quantity}
                </span>
                <Button
                  size="icon"
                  className="size-7"
                  onClick={() => increaseQty(item.id)}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Total + Tombol */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
          <Button
            variant="outline"
            className="mr-30 md:w-full cursor-pointer"
            onClick={handleClearCart}
          >
            Clear
          </Button>
          <Button
            className="cursor-pointer md:w-full mt-4"
            onClick={handleContinuePayment}
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Kasir;
