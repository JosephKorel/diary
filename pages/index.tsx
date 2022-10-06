import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "../node_modules/next/head";
import { useRouter } from "next/router";

interface User {
  name: string;
  email?: string;
  avatar?: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setUser({
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
      });
      addUser();
      router.push({
        pathname: "[email]",
        query: { email: session.user.email },
      });
    }
  }, [status]);

  const handleSignIn = async () => {
    try {
      await signIn("google", { redirect: false });
    } catch (error) {
      console.log("Erro");
    }
  };

  const addUser = async () => {
    if (status === "authenticated") {
      const user = {
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
      };

      try {
        await fetch("/api/user/new_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Not logged in");
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {status === "authenticated" ? (
          <div>
            <h1>Bem vindo(a), {session.user.name}</h1>
            <button onClick={() => signOut()}>Sair</button>
            <button onClick={addUser}>Novo usuário</button>
            <input
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
          </div>
        ) : (
          <div>
            Faça login para continuar
            <button onClick={handleSignIn}>Entrar</button>
          </div>
        )}
      </main>
    </div>
  );
}
/* 
export async function getServerSideProps(context) {
  try {

    const data = await axios.get("/api/search");
    const results = data.data;

    return {
      props: { categories: results },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
} */
