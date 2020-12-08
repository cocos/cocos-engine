#pragma once

namespace cc {

class Job;

class JobGraph {
public:

    JobGraph() noexcept {}
    ~JobGraph() = default;
    JobGraph(JobGraph const&) = delete;
    JobGraph(JobGraph&&) = delete;
    JobGraph& operator=(JobGraph const&) = delete;
    JobGraph& operator=(JobGraph&&) = delete;

    template <typename Function, typename... Args>
    virtual Job *createJob(Function&& func, Args&&... args) noexcept = 0;

private:

};

} // namespace cc
