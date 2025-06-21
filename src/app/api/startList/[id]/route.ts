import { deleteStartList } from "@/services/startListService";
import { NextResponse } from "next/server";



export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  // try {
  //   const res = await deleteStartList(id)
  //   return NextResponse.json(res.data)
  // } catch (error) {
  //   console.error("Error deleting start list:", error);
  //   return NextResponse.json({ error: "Failed to delete start list" }, { status: 500 });
  // }
  const res = await deleteStartList(id)
  console.log(res);
  
  return NextResponse.json({ message: "Start list deleted successfully" }, { status: 200 });
}