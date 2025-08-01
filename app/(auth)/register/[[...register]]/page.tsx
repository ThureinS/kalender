import Image from "next/image";
import {SignUp} from "@clerk/nextjs";

const RegisterPage = () => {
    return (
        <main className="flex flex-col items-center p-5 gap-10 animate-fade-in">
            <Image src='/assets/logo.svg' alt="Logo" width={100} height={100} />

            <div className="mt-3">
                <SignUp/>
            </div>
        </main>
    );
};

export default RegisterPage;