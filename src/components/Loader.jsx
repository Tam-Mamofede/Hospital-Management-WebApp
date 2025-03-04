const Loader = () => {
  return (
    <section className="my-4 flex h-full w-full items-center justify-center">
      <div className="mr-2 h-5 w-5 animate-pulse rounded-full bg-[#b3d4fc] delay-[-0.3s]"></div>
      <div className="mr-2 h-5 w-5 animate-pulse rounded-full bg-[#b3d4fc] delay-[-0.1s]"></div>
      <div className="mr-2 h-5 w-5 animate-pulse rounded-full bg-[#b3d4fc] delay-[0.1s]"></div>
      <div className="mr-2 h-5 w-5 animate-pulse rounded-full bg-[#b3d4fc]"></div>
      <div className="h-5 w-5 animate-pulse rounded-full bg-[#b3d4fc]"></div>
    </section>
  );
};

export default Loader;
