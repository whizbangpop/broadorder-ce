import React from "react";
import { Link } from "react-router-dom";

function ButtonLink({ to, children }) {
    return <Link to={to} className="bg-sky-900 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"><button>{children}</button></Link>;
  }

function Home() {
    return (
        <div>
            <div className="text-center mt-10">
                <h1 className="text-3xl font-bold">Welcome to BroadOrder CE</h1>
                <p><strong>Instance</strong>: PwkAcademy</p>
            </div>
            <div className="flex flex-row items-center justify-center gap-5 mt-10">
                <ButtonLink to="/order" >Start Order</ButtonLink>
            </div>
        </div>
    );
}

export default Home;