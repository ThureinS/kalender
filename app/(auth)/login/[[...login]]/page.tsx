import Image from "next/image";
import {SignIn} from "@clerk/nextjs";

const LoginPage = () => {
    return (
        <main className="flex flex-col items-center p-5 gap-10 animate-fade-in">
            <Image src='/assets/logo.svg' alt="Logo" width={100} height={100} />

            <div className="mt-3">
                <SignIn/>
            </div>
        </main>
    );
};

export default LoginPage;