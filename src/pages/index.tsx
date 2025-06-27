import supabase from "@/lib/db";
import type {IMenu} from "@/types/menu";
import {useEffect, useState} from "react";

const Home = () => {
  const [menus, setMenus] = useState<IMenu[]>([]);
  useEffect(() => {
    const fetchMenus = async () => {
      const {data, error} = await supabase.from("menus").select("*");
      if (error) console.log(error);
      else setMenus(data);
    };

    fetchMenus();
  }, [supabase]);
  return (
    <div>
      <div>Home</div>
    </div>
  );
};
export default Home;
