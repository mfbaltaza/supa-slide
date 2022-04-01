import { useState } from "react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { supabase } from "../api";
import { Divider } from "@supabase/ui";

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });
const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState);
  const { title, content} = post;
  const [mdeOptions, setMdeOptions] = useState({
    spellChecker: false
  })

  const router = useRouter()
  // This function below handles the input data
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function createNewPost() {
    if (!title || !content) return

    const user = supabase.auth.user();
    const id = uuid()
    post.id = id
    const { data } = await supabase
      .from('posts')
      .insert([
          { title, content, user_id: user.id, user_email: user.email }
      ])
      .single()
    router.push(`/posts/${data.id}`)
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 space-y-2"
        type="text" />
        <SimpleMDE 
          options={mdeOptions}
          value={post.content}
          onChange={value => setPost({ ...post, content: value })}
          />
        <button
          type="button"
          className="mb-4 bg-green-500 text-white font-semibold px-8 py-2 rounded-lg"
          onClick={createNewPost}
        >
          Create Post
        </button>
    </div>
  )
}

export default CreatePost