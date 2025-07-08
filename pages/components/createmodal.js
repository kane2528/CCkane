import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreatePostModal({ setShowCreateModal, theme }) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "",
        detail: {},
        tags: [],
        communityId: "",
    });

    const [userCommunities, setUserCommunities] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingCommunities, setLoadingCommunities] = useState(true);

    // Fetch user's communities on mount
    useEffect(() => {
        const fetchUserCommunities = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SITE_URL}/api/community/user-communities`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUserCommunities(res.data.communities); // assuming API returns { communities: [...] }
            } catch (error) {
                console.error("Failed to fetch communities:", error);
                toast.error("Failed to load communities");
            } finally {
                setLoadingCommunities(false);
            }
        };

        fetchUserCommunities();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTagsChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            tags: e.target.value.split(",").map((tag) => tag.trim()),
        }));
    };

    const handleDetailChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            detail: { ...prev.detail, [e.target.name]: e.target.value },
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!formData.communityId) {
            toast.error("Please select a community");
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/add-post/${formData.communityId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Post created successfully!");
            setShowCreateModal(false);
        } catch (err) {
            console.error("Post creation failed:", err);
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className={`w-full max-w-lg mx-auto rounded-2xl p-6 relative shadow-2xl ${theme === "dark"
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white"
                    : "bg-white text-indigo-900"
                    }`}
            >
                <button
                    onClick={() => setShowCreateModal(false)}
                    className="absolute top-4 right-4 text-xl font-bold"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Community Dropdown */}
                    {loadingCommunities ? (
                        <p>Loading communities...</p>
                    ) : (
                        <select
                            name="communityId"
                            value={formData.communityId}
                            onChange={handleChange}
                            className="w-full text-black p-3 rounded-xl border"
                            required
                        >
                            <option value="">Select a Community</option>
                            {userCommunities.map((comm) => (
                                <option key={comm._id} value={comm._id}>
                                    {comm.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <input
                        type="text"
                        name="title"
                        placeholder="Post Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full text-black p-3 rounded-xl border"
                        required
                    />

                    <textarea
                        name="content"
                        placeholder="Content"
                        value={formData.content}
                        onChange={handleChange}
                        className="w-full text-black p-3 rounded-xl border h-28 resize-none"
                        required
                    />

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full text-black p-3 rounded-xl border"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Job">Job</option>
                        <option value="Internship">Internship</option>
                        <option value="Hackathon">Hackathon</option>
                        <option value="PersonalProject">Personal Project</option>
                    </select>


                    {formData.category === "Hackathon" && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Hackathon Name"
                                onChange={handleDetailChange}
                                className="w-full p-3 rounded-xl border"
                                required
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Location"
                                onChange={handleDetailChange}
                                className="w-full p-3 rounded-xl border"
                            />
                        </>
                    )}


                    <input
                        type="text"
                        name="tags"
                        placeholder="Tags (comma separated)"
                        onChange={handleTagsChange}
                        className="w-full text-black p-3 rounded-xl border"
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 rounded-xl font-bold transition hover:scale-105 ${theme === "dark"
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                    >
                        {isSubmitting ? "Posting..." : "Create Post"}
                    </button>
                </form>
            </div>
        </div>
    );
}
